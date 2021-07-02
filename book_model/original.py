from tfidf import TfIdf
import unittest
import konlpy
import os
import sys
import urllib.request
import xmltodict
import json
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import re
import time

def test_similarity(titles, authors, descriptions, orgDscrpt):
    table = TfIdf()
    for i, title in enumerate(titles):
        author = authors[i]
        description = descriptions[i]
        docName = author + ":" + title
        table.add_document(docName, description)
    return table.similarities(orgDscrpt)

def recommend_books(orgTitle, orgAuthor, client_id, client_secret):
    title = urllib.parse.quote(orgTitle)
    author = urllib.parse.quote(orgAuthor)
    url = "https://openapi.naver.com/v1/search/book_adv.xml?d_titl=" + title + "&d_auth=" + author  # 상세검색 xml 결과
    # url = "https://openapi.naver.com/v1/search/book.xml?query=" + encText # xml 결과
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    response = urllib.request.urlopen(request)
    rescode = response.getcode()
    if (rescode == 200):
        response_body = response.read()
        orgTxt = response_body.decode('utf-8')
        # print(orgTxt)
    else:
        print("Error Code:" + rescode)
    cc = xmltodict.parse(orgTxt)
    dd = json.loads(json.dumps(cc))
    if 'link' in dd['rss']['channel']['item']:
        link = dd['rss']['channel']['item']['link']
        orgDscrpt = dd['rss']['channel']['item']['description']
    else:
        link = dd['rss']['channel']['item'][0]['link']
        orgDscrpt = dd['rss']['channel']['item'][0]['description']
    print(orgDscrpt)
    webdriver_options = webdriver.ChromeOptions()
    webdriver_options.add_argument('headless')
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=webdriver_options)
    driver.implicitly_wait(30)

    driver.get(link)
    bsObject = BeautifulSoup(driver.page_source, 'html.parser')
    categories = bsObject.find_all('a', {'class': re.compile('N=a:bok.category,r:\d,i:(\d{9})')})
    catLinks = list()
    for category in categories:
        catLink = 'http://book.naver.com' + category.get('href')
        catLinks.append(catLink)
    titles = list()
    authors = list()
    for catLink in catLinks:
        for i in range(1, 6):
            url = catLink + '&tab=top100&list_type=list&sort_type=publishday&page=' + str(i)
            driver.get(url)
            bsObject = BeautifulSoup(driver.page_source, 'html.parser')
            tmps = bsObject.find_all('dd', {'class': 'txt_block'})
            for tmp in tmps:
                tmpA = tmp.find('a', {'class': 'N=a:bta.author'})
                if tmpA != None:
                    authors.append(tmpA.get_text())
            tmpT = bsObject.find_all('a', {'class': 'N=a:bta.title'})
            titles.extend([title.get_text() for title in tmpT])
            # tmpA = bsObject.find_all('a', {'class':'N=a:bta.author'})
    titles = list(filter(None, titles))

    descriptions = list()
    for i, title in enumerate(titles):
        author = urllib.parse.quote(authors[i])
        title = urllib.parse.quote(title)
        url = "https://openapi.naver.com/v1/search/book_adv.xml?d_titl=" + title + "&d_auth=" + author  # 상세검색 xml 결과
        # url = "https://openapi.naver.com/v1/search/book.xml?query=" + encText # xml 결과
        request = urllib.request.Request(url)
        request.add_header("X-Naver-Client-Id", client_id)
        request.add_header("X-Naver-Client-Secret", client_secret)
        response = urllib.request.urlopen(request)
        rescode = response.getcode()
        if (rescode == 200):
            response_body = response.read()
            orgTxt = response_body.decode('utf-8')
            # print(orgTxt)
        else:
            print("Error Code:" + rescode)
        cc = xmltodict.parse(orgTxt)
        dd = json.loads(json.dumps(cc))
        if 'item' not in dd['rss']['channel']:
            description = ''
        elif 'description' in dd['rss']['channel']['item']:
            description = dd['rss']['channel']['item']['description']
        else:
            description = dd['rss']['channel']['item'][0]['description']
        descriptions.append(description)
        print(i)
        time.sleep(0.1)

    sim = test_similarity(titles, authors, descriptions, orgDscrpt)

    res = sorted(sim, key=(lambda x: x[1]), reverse=True)
    print(res)
    i = 0
    for elem in res:
        if orgTitle not in elem[0]:
            print(elem[0])
            i += 1
        if i == 5:
            break

if __name__ == "__main__":
    client_id = "tTVi8O15QxJsXLoSif8l"
    client_secret = "1LpGHCFhhd"
    title = "역사의 쓸모"
    author = "최태성"
    recommend_books(title, author, client_id, client_secret)