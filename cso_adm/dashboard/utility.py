import gspread
from oauth2client.service_account import ServiceAccountCredentials
from .models import Map, PostActsLog

lock = False


def check_worksheet(worksheet_key_test, sheet_name_test):
    try:
        print("Authorizing credentials...")
        scope = ['https://spreadsheets.google.com/feeds']
        creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
        client = gspread.authorize(creds)

        print("Accessing worksheet...")
        client.open_by_key(worksheet_key_test).worksheet(sheet_name_test)

        return True
    except Exception as e:
        print("ERROR: " + str(e))
        print(">> Worksheet not found.")

        return False


def change_worksheet():
    lock = True

    try:
        worksheet_key = Map.objects.get(key='worksheet_key').value
        sheet_name = Map.objects.get(key='sheet_name').value

        start_row = int(Map.objects.get(key='start_row').value)

        print("Authorizing credentials...")
        scope = ['https://spreadsheets.google.com/feeds']
        creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
        client = gspread.authorize(creds)

        print("Accessing worksheet...")
        sheet = client.open_by_key(worksheet_key).worksheet(sheet_name)

        PostActsLog.objects.all().delete()

        print("Scanning new data...")
        print('Starting row: ' + str(start_row))
        print('Starting column: 1')
        print('Ending row: ' + str(sheet.row_count))
        print('Ending column: ' + str(sheet.col_count))
        data = sheet.range(start_row, 1, sheet.row_count, sheet.col_count)
        print("Scanning finish!")
        print("Syncing data to database...")

        current_row = data[0].row
        i = 0
        log = PostActsLog(row_number=current_row)
        cnt = 0
        while i < len(data):
            if current_row != data[i].row:
                log.save()
                current_row = data[i].row
                log = PostActsLog(row_number=current_row)
                cnt = cnt + 1
            current_col = data[i].col

            try:
                key = Map.objects.get(value="COLUMN " + str(current_col)).key
                setattr(log, key, str(data[i].value))
            except Exception as e:
                print("ERROR: " + str(e))
                print(">> Set attribute error for row " + str(current_row) + " column " + str(current_col) + ".")

            i = i + 1
        if len(PostActsLog.objects.filter(row_number=log.row_number)) == 0:
            log.save()
            cnt = cnt + 1
        else:
            print("Row number " + str(log.row_number) + " already exists.")

        print("Syncing finish!")
        print("Added " + str(cnt) + " rows.")

    except Exception as e:
        print("ERROR: " + str(e))
        print(">> Sync failed.")

    lock = False


def resync():
    lock = True
    try:
        worksheet_key = Map.objects.get(key='worksheet_key').value
        sheet_name = Map.objects.get(key='sheet_name').value

        start_row = int(Map.objects.get(key='start_row').value)

        print("Authorizing credentials...")
        scope = ['https://spreadsheets.google.com/feeds']
        creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
        client = gspread.authorize(creds)

        print("Accessing worksheet...")
        sheet = client.open_by_key(worksheet_key).worksheet(sheet_name)

        print("Checking for changes...")
        data = sheet.range(start_row, 1, sheet.row_count, sheet.col_count)

        PostActsLog.objects.filter(row_number__gt=sheet.row_count).delete()

        current_row = data[0].row
        i = 0
        log = PostActsLog.objects.get(row_number=current_row)
        cnt = 0
        while i < len(data):
            if current_row != data[i].row:
                log.save()
                current_row = data[i].row
                log = PostActsLog.objects.get(row_number=current_row)
                cnt = cnt + 1
            current_col = data[i].col

            try:
                key = Map.objects.get(value="COLUMN " + str(current_col)).key
                setattr(log, key, str(data[i].value))
            except Exception as e:
                print("ERROR: " + str(e))
                print(">> Set attribute error for row " + str(current_row) + " column " + str(current_col) + ".")

            i = i + 1


        log.save()
        cnt = cnt + 1

    except Exception as e:
        print("ERROR: " + str(e))
        print(">> Sync failed.")
    lock = False


def sync():
    lock = True
    try:
        worksheet_key = Map.objects.get(key='worksheet_key').value
        sheet_name = Map.objects.get(key='sheet_name').value

        start_row = int(Map.objects.get(key='start_row').value)

        print("Authorizing credentials...")
        scope = ['https://spreadsheets.google.com/feeds']
        creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
        client = gspread.authorize(creds)

        print("Accessing worksheet...")
        sheet = client.open_by_key(worksheet_key).worksheet(sheet_name)

        log_rows = PostActsLog.objects.all().count()
        print("Checking for changes...")
        if log_rows < sheet.row_count - start_row + 1:
            print("New data found!")
            print("Scanning new data...")
            print('Starting row: ' + str(log_rows + start_row))
            print('Starting column: 1')
            print('Ending row: ' + str(sheet.row_count))
            print('Ending column: ' + str(sheet.col_count))
            data = sheet.range(log_rows + start_row, 1, sheet.row_count, sheet.col_count)
            print("Scanning finish!")
            print("Syncing data to database...")

            current_row = data[0].row
            i = 0
            log = PostActsLog(row_number=current_row)
            cnt = 0
            while i < len(data):
                if current_row != data[i].row:
                    log.save()
                    current_row = data[i].row
                    log = PostActsLog(row_number=current_row)
                    cnt = cnt + 1
                current_col = data[i].col

                try:
                    key = Map.objects.get(value="COLUMN " + str(current_col)).key
                    setattr(log, key, str(data[i].value))
                except Exception as e:
                    print("ERROR: " + str(e))
                    print(">> Set attribute error for row " + str(current_row) + " column " + str(current_col) + ".")

                i = i + 1
            if len(PostActsLog.objects.filter(row_number=log.row_number)) == 0:
                log.save()
                cnt = cnt + 1
            else:
                print("Row number " + str(log.row_number) + " already exists.")

            print("Syncing finish!")
            print("Added " + str(cnt) + " rows.")
        else:
            print("No new data to sync.")
    except Exception as e:
        print("ERROR: " + str(e))
        print(">> Sync failed.")

    lock = False


def update_cells(list):
    try:
        worksheet_key = Map.objects.get(key='worksheet_key').value
        sheet_name = Map.objects.get(key='sheet_name').value

        start_row = int(Map.objects.get(key='start_row').value)

        print("Authorizing credentials...")
        scope = ['https://spreadsheets.google.com/feeds']
        creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
        client = gspread.authorize(creds)

        print("Accessing worksheet...")
        sheet = client.open_by_key(worksheet_key).worksheet(sheet_name)
        print("Updating cell...")
        for cell in list:
            sheet.update_cell(cell[0], cell[1].split(" ")[1], cell[2])
        print("Updating finish!")
        return True
    except Exception as e:
        print("ERROR: " + str(e))
        print(">> Update failed.")
        return False
