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
import pandas as pd
import numpy as np
from functools import lru_cache

from flask import Flask
from flask import request as req
app = Flask(__name__)



def test_similarity(titles, authors, descriptions, orgDscrpt):
    table = TfIdf()
    for i, title in enumerate(titles):
        author = authors[i]
        description = descriptions[i]
        docName = author + ":" + title
        table.add_document(docName, description)
    return table.similarities(orgDscrpt)


cache = {}

@app.route("/recommend")
def recommend_books():
    orgTitle = req.args.get('orgTitle')
    orgAuthor = req.args.get('orgAuthor')

    if orgTitle in cache:
        return cache[orgTitle]

    client_id = "tTVi8O15QxJsXLoSif8l"
    client_secret = "1LpGHCFhhd"

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

    webdriver_options = webdriver.ChromeOptions()
    webdriver_options.add_argument('headless')
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=webdriver_options)
    driver.implicitly_wait(30)

    driver.get(link)
    bsObject = BeautifulSoup(driver.page_source, 'html.parser')
    categories = bsObject.find_all('a', {'class': re.compile('N=a:bok.category,r:\d,i:(\d{9})')})
    if categories == []:
        categories = bsObject.find_all('a', {'class': re.compile('N=a:bok.category,r:\d,i:(\d{6})')})
    if categories == []:
        categories = bsObject.find_all('a', {'class': re.compile('N=a:bok.category,r:\d,i:(\d{3})')})
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
    #image url, title, author, description
    sim = test_similarity(titles, authors, descriptions, orgDscrpt)

    res = sorted(sim, key=(lambda x: x[1]), reverse=True)
    i = 0
    result = []
    initElem = ' ' + orgAuthor + ':' + orgTitle
    redundant = [initElem]
    for elem in res:
        if elem[0] not in redundant:
            result.append(elem[0])
            redundant.append(elem[0])
            i += 1
        if i == 5:
            break
    final = list()

    gukbang_lib = pd.read_csv('gukbang_lib.csv', names = ['key', 'title', 'author', 'publisher', 'year', 'isbn', 'category', 'kdc', 'ddc', 'etc', 'page', 'size', 'price', 'lib_code', 'lib_name', 'status'], encoding = 'CP949')

    for elem in result:
        tit_aut = elem.split(':')
        finalDict = dict()
        tit = tit_aut[1]
        finalDict['title'] = tit_aut[1]
        aut = tit_aut[0]
        finalDict['author'] = tit_aut[0]
        sch = urllib.parse.quote(tit + ' ' + aut)
        url = "https://openapi.naver.com/v1/search/book.json?query=" + sch + "&display=1"
        # url = "https://openapi.naver.com/v1/search/book.xml?query=" + encText
        request = urllib.request.Request(url)
        request.add_header("X-Naver-Client-Id", client_id)
        request.add_header("X-Naver-Client-Secret", client_secret)
        response = urllib.request.urlopen(request)
        rescode = response.getcode()
        if (rescode == 200):
            response_body = response.read()
            orgTxt = response_body.decode('utf-8')
            bookDict = json.loads(orgTxt)
            if 'items' not in bookDict:
                description = ''
            elif 'description' in bookDict['items']:
                finalDict['description'] = bookDict['items']['description']
                finalDict['imageURL'] = bookDict['items']['image']
                isbn = bookDict['items']['isbn']
            else:
                finalDict['description'] = bookDict['items'][0]['description']
                finalDict['imageURL'] = bookDict['items'][0]['image']
                isbn = bookDict['items'][0]['isbn']

        else:
            print("Error Code:" + rescode)
        #find_row = gukbang_lib.loc[(gukbang_lib['isbn'] == isbn)]
        #https://nddl.mil.kr/search/main.do?query=식이섬유의%20과학%20정동효%20신광문화사
        gukbang_link = None
        indices = gukbang_lib.index[gukbang_lib['isbn'] == isbn].tolist()
        if len(indices) > 0:
            index = indices[0]
            title = str(gukbang_lib.iloc[index]['title'])
            author = str(gukbang_lib.iloc[index]['author'])
            publisher = str(gukbang_lib.iloc[index]['publisher'])
            gukbang_link = 'https://nddl.mil.kr/search/main.do?query=' + title + ' ' + author + ' ' + publisher
        finalDict['libURL'] = gukbang_link
        final.append(finalDict)

    final_result = json.dumps(final, ensure_ascii=False)
    cache[orgTitle] = final_result
    return final_result

if __name__ == "__main__":
    client_id = "tTVi8O15QxJsXLoSif8l"
    client_secret = "1LpGHCFhhd"
    title = "Do it! 점프 투 파이썬"
    author = "박응용"
    #recommend_books(title, author, client_id, client_secret)

