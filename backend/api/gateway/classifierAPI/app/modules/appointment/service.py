from app.modules.appointment.model import AppointmentRequest
from app.modules.appointment.repository import AppointmentRepository
from datetime import datetime , timedelta 
import math
from fastapi import HTTPException, Depends


def lower_bound(vect : list , x : datetime):
    l = 0
    r = len(vect) - 1
    answer = len(vect)

    while l <= r:
        mid = (l + r) // 2 

        if vect[mid] >= x:
            answer = mid 
            r = mid - 1
        else:
            l = mid + 1

    return answer

def search_for_empty_slot(prior : str , appointments : list):
    appointments = [datetime.strptime(data , "%Y-%m-%d %H:%M") for data in appointments]
    appointments = sorted(appointments)
    
    present = datetime.now()
   # present = datetime(year = present.year , month = present.month , day = 23 , hour = 14 , minute= 0)

    present_day_of_the_week = present.isoweekday()

    present_day_start = datetime(year = present.year , month = present.month , day = present.day , hour = 8 , minute= 0)
    present_day_final = datetime(year = present.year , month = present.month , day = present.day , hour = 15 , minute= 0)

    days = [[] for i in range(0 , 8)]

    ptr = lower_bound(appointments , present)

    free_slots = []

    while True: 
        current_time = present_day_start

        while current_time.isoweekday() <= 5 and current_time <= present_day_final:
            if ptr < len(appointments) and current_time == appointments[ptr]:
                days[current_time.isoweekday()].append(current_time)
                ptr += 1
            elif current_time >= present:
                free_slots.append(current_time)

            current_time += timedelta(hours = 1)

        present_day_start += timedelta(days = 1)
        present_day_final += timedelta(days = 1)

        # print(present_day_start.isoweekday())
        # print(present_day_final.strftime("%Y-%m-%d %H:%M"))

        if present_day_start.isoweekday() == present_day_of_the_week:
            break

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

    # for i in days:
    #     print(i)

    return datetime.strftime(free_slots[prior_idx[prior_trans]] , "%Y-%m-%d %H:%M")
    

class AppointmentService:
    @staticmethod
    async def make_appointment(req : AppointmentRequest , user):
        try:
            appointments = await AppointmentRepository.get_calendar(req.doctor_id)
        except Exception:
            raise HTTPException(500 , "There was a problem fetching medic calendar")

        date = search_for_empty_slot(req.prior , appointments)
        #print(appointments)

        if date == None:
            raise HTTPException(400 , "Couldn't find suitable date this week")
        
        #await AppointmentRepository.insert(date , req.id_med)
        return {"date" : date}