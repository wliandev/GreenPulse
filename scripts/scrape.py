from selenium import webdriver
import pandas as pd
import urllib.request
import json
import yfinance as yahooFinance

def scrape_name_and_ticker(): # scrape name and ticker
    myService = webdriver.FirefoxService(executable_path='/home/lillian/Documents/Programming/Schoolwork/568/data/geckodriver')
    driver = webdriver.Firefox(service=myService)
    url = 'https://stockanalysis.com/list/sp-500-stocks/'
    driver.get(url)

    tickers = driver.find_elements('xpath', '//td[@class="sym svelte-eurwtr"]')
    companies = driver.find_elements('xpath', '//td[@class="slw svelte-eurwtr"]')

    tickers_list = []
    for t in range(len(tickers)):
        tickers_list.append(tickers[t].text)

    company_list = []
    for c in range(len(companies)):
        company_list.append(companies[c].text.replace(',', ''))

    return([tickers_list, company_list])

def download_esg_data(ticker): # download ESG data
    url = "https://query2.finance.yahoo.com/v1/finance/esgChart?symbol=" + ticker
    try:
        connection = urllib.request.urlopen(url)
        data = connection.read()
        data_2 = json.loads(data)
        Formatdata = data_2["esgChart"]["result"][0]["symbolSeries"]
        Formatdata_2 = pd.DataFrame(Formatdata)
        Formatdata_2["timestamp"] = pd.to_datetime(Formatdata_2["timestamp"], unit="s")

        # drop ESG data from before 2020 and rows with no ESG score
        m = Formatdata_2["timestamp"].between("2020-01-01", "2024-04-23", inclusive="left")
        Formatdata_3 = Formatdata_2.drop(m[~m].index)
        Formatdata_4 = Formatdata_3.dropna()
        
        Formatdata_4.to_csv('ESG_data/esg_' + ticker + '.csv', index=True)
    except Exception as e:
        print(e)

def download_stock_data(ticker): # download stock data
    start_date = "2020-01-01"
    end_date = "2024-04-23"
    stock_info = yahooFinance.Ticker(ticker)
    stock_data = stock_info.history(period="1y", start=start_date, end=end_date)
    stock_data.to_csv("Stock_data/stock_" + ticker + ".csv")

def scrape_esg_info(my_tickers): # scrape industry and most recent ESG scores
    t_dict = dict()
    for ticker in my_tickers:
        url = "https://query2.finance.yahoo.com/v1/finance/esgChart?symbol=" + ticker
        try:
            connection = urllib.request.urlopen(url)
            data = connection.read()
            data_2 = json.loads(data)
            t_dict[ticker] = []
            t_dict[ticker].append(data_2["esgChart"]["result"][0]["peerGroup"])
            t_dict[ticker].append(data_2["esgChart"]["result"][0]["symbolSeries"]["environmentScore"][-1])
            t_dict[ticker].append(data_2["esgChart"]["result"][0]["symbolSeries"]["socialScore"][-1])
            t_dict[ticker].append(data_2["esgChart"]["result"][0]["symbolSeries"]["governanceScore"][-1])
            t_dict[ticker].append(data_2["esgChart"]["result"][0]["symbolSeries"]["esgScore"][-1])
        except Exception as e:
            print(e)
    return t_dict

def write_csv(my_tickers, my_companies, info_1): # write data for model
    file = open("company_list.csv", "w")
    file.write("symbol,name,industry,E,S,G,ESG\n")
    for i in range(len(my_tickers)):
        file.write(my_tickers[i] + "," + my_companies[i] + ",")
        if my_tickers[i] in info_1:
            try:
                file.write(info_1[my_tickers[i]][0] + ",")
                file.write(str(info_1[my_tickers[i]][1]) + ",")
                file.write(str(info_1[my_tickers[i]][2]) + ",")
                file.write(str(info_1[my_tickers[i]][3]) + ",")
                file.write(str(info_1[my_tickers[i]][4]) + ",")
            except:
                file.write(" , , , , ,")
        else:
            file.write(" , , , , ,")
        file.write("\n")
    file.close()

if __name__=="__main__":
    info = scrape_name_and_ticker() 
    my_tickers = info[0]
    my_companies = info[1]
    for i in range(len(my_tickers)):
        download_esg_data(my_tickers[i])
        download_stock_data(my_tickers[i])
    info_1 = scrape_esg_info(my_tickers)
    write_csv(my_tickers, my_companies, info_1)
