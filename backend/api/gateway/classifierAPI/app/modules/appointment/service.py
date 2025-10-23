from app.modules.appointment.model import AppointmentRequest
from app.modules.appointment.repository import AppointmentRepository
from datetime import datetime , timedelta 
import math
from fastapi import HTTPException, Depends


def search_for_empty_slot(prior : str , appointments : list):
    appointments = [datetime.strptime(data , "%Y-%m-%d %H:%M") for data in appointments]
    appointments = sorted(appointments)
    
    present = datetime.now()
    present = datetime(year = present.year , month = present.month , day = 23 , hour = 14 , minute= 0)

    present_day_start = datetime(year = present.year , month = present.month , day = present.day , hour = 8 , minute= 0)
    present_day_final = datetime(year = present.year , month = present.month , day = present.day , hour = 15 , minute= 0)
    
    while present_day_start.isoweekday() > 5:
        present_day_start += timedelta(days = 1)
        present_day_final += timedelta(days = 1)

    days = [[] for i in range(0 , 8)]

    ptr = 0

    while len(appointments) > ptr and appointments[ptr]  < max(present_day_start , present):
        ptr += 1

    free_slots = []

    while present_day_start.isoweekday() != 6: 
        current_time = present_day_start

        while current_time <= present_day_final:
            if ptr < len(appointments) and current_time == appointments[ptr]:
                days[current_time.isoweekday()].append(current_time)
                ptr += 1
            elif current_time >= present:
                free_slots.append(current_time)

            current_time += timedelta(hours = 1)

        present_day_start += timedelta(days = 1)
        present_day_final += timedelta(days = 1)

    if len(free_slots) == 0:
        return None 

    LOW = math.floor(20 / 100 * len(free_slots))
    MEDIUM = math.floor(60 / 100 * len(free_slots))
    HIGH = math.floor(20 / 100 * len(free_slots))
    LOW += len(free_slots) - MEDIUM - HIGH - LOW

    prior_numb = {"Low" : 0 , "Medium" : 1 , "High" : 2}
    prior_idx = {2 : 0 , 1 : HIGH , 0 : MEDIUM + HIGH}
    prior_quants = {0 : LOW , 1 : MEDIUM , 2 : HIGH}

    prior_trans = prior_numb[prior]

    while prior_quants[prior_trans] == 0:
        prior_trans -= 1
        prior_trans += 3
        prior_trans %= 3

    for i in days:
        print(i)

    return datetime.strftime(free_slots[prior_idx[prior_trans]] , "%Y-%m-%d %H:%M")
    

class AppointmentService:
    @staticmethod
    async def make_appointment(req : AppointmentRequest , user):
        try:
            appointments = await AppointmentRepository.get_calendar(req.id_med)
        except Exception:
            raise HTTPException(500 , "There was a problem fetching medic calendar")

        date = search_for_empty_slot(req.prior , appointments)
        #print(appointments)

        if date == None:
            raise HTTPException(400 , "Couldn't find suitable date this week")
        
        await AppointmentRepository.insert(date , req.id_med)
        return {"date" : date}