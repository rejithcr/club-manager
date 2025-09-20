import re
from src import constants

from datetime import datetime
from dateutil.relativedelta import relativedelta


def snake_to_camel(name):
    return re.sub(r"_([a-zA-Z0-9])", lambda match: match.group(1).upper(), name)


def convert_to_camel_case(data: dict):
    if isinstance(data, dict):
        return {snake_to_camel(key): convert_to_camel_case(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_to_camel_case(item) for item in data]
    else:
        return data


def get_dates_of_period(club_fee_type_interval, latestPeriodDate):
    current_year = datetime.now().year
    date_objects = []
    print(club_fee_type_interval)
    range_start = -2  # need to fix the dynamic range. case: collection restart after long gap
    if latestPeriodDate:
        start_date = latestPeriodDate
        range_start = 1
    else:
        start_date = datetime.now().date()

    if club_fee_type_interval == 'MONTHLY':
        for i in range(range_start, 3):
            temp_date = start_date + relativedelta(months=i)
            temp_date = temp_date.replace(day=1)
            date_objects.append({"date": temp_date.strftime('%Y-%m-%d'),
                                 "label": temp_date.strftime('%b-%Y').upper()})
    elif club_fee_type_interval == 'QUARTERLY':
        for i in range(range_start, 3):
            temp_date = start_date + relativedelta(months=i * 3)
            temp_date = temp_date.replace(day=1)
            date_objects.append({"date": temp_date.strftime('%Y-%m-%d'),
                                 "label": f"Q{int((temp_date.month - 1) / 3 + 1)}-" + temp_date.strftime('%Y').upper()})
    elif club_fee_type_interval == 'YEARLY':
        for i in range(range_start, 3):
            temp_date = start_date + relativedelta(years=i)
            temp_date = temp_date.replace(day=1).replace(month=1)
            date_objects.append({"date": temp_date.strftime('%Y-%m-%d'),
                                 "label": temp_date.strftime('%Y').upper()})

    return date_objects


def pivot_data(data):
    pivoted_list = []
    for item in data:
        first_name = item['first_name'].strip() if item['first_name'] else ''
        last_name = item['last_name'].strip() if item['last_name'] else ''
        phone = item['phone'].strip() if item['email'] else ''
        email = item['email'].strip() if item['email'] else ''
        dob = item['date_of_birth'].strip() if item['date_of_birth'] else ''

        pivoted = {
            att["attribute"]: att["attribute_value"]
            for att in item['attributes']
            if att["attribute"] is not None and att["attribute_value"] is not None
        }

        pivoted['first_name'] = first_name
        pivoted['last_name'] = last_name
        pivoted['phone'] = phone
        pivoted['email'] = email
        pivoted['date_of_birth'] = dob
        pivoted_list.append(pivoted)

    return pivoted_list


def remove_pii(keys, object_list):
    # Step 1: Build reverse mapping label -> key
    label_key_map = {entry['label']: entry['key'] for entry in constants.PII_ATTRIBUTES_MAPPING}

    # Step 2: Filter each object
    filtered_objects = []
    for obj in object_list:
        filtered_obj = {}
        for k, v in obj.items():
            if k in label_key_map:
                # Only include if corresponding key is in `keys`
                if label_key_map[k] in keys:
                    filtered_obj[k] = v
            else:
                # If key not mapped, keep it
                filtered_obj[k] = v
        filtered_objects.append(filtered_obj)

    return filtered_objects
