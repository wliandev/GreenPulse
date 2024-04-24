from sp500.models import Company
import csv

def run():
    with open('/home/lillian/Documents/Programming/Schoolwork/568/FinalProject/GreenPulse/scripts/company_list.csv') as file:
        reader = csv.reader(file)
        next(reader)

        Company.objects.all().delete()

        for row in reader:
            print(row)

            company = Company(symbol=row[0],name=row[1],industry=row[2],E=row[3],S=row[4],G=row[5],ESG=row[6])

            company.save()
