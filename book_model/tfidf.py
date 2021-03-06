#!/usr/bin/env python

"""The simplest TF-IDF library imaginable.

Add your documents as two-element lists `[docname,
[list_of_words_in_the_document]]` with `addDocument(docname, list_of_words)`.
Get a list of all the `[docname, similarity_score]` pairs relative to a
document by calling `similarities([list_of_words])`.

See the README for a usage example.

"""

import sys
import os
import re
import konlpy

class TfIdf:
    def __init__(self):
        self.weighted = False
        self.documents = []
        self.corpus_dict = {}

    def add_document(self, doc_name, doc_content):
        # building a dictionary
        # 불용어 제거
        if doc_content == None:
            return
        document = re.sub(r'[^ ㄱ-ㅣ가-힣]', '', doc_content)
        okt = konlpy.tag.Okt()
        clean_words = list()
        #조사, 부사 등 불용어 제거
        for word in okt.pos(document, stem=True):
            if word[1] in ['Noun', 'Verb', 'Adjective']:
                clean_words.append(word[0])
        doc_dict = {}
        list_of_words = clean_words
        for w in list_of_words:
            doc_dict[w] = doc_dict.get(w, 0.) + 1.0
            self.corpus_dict[w] = self.corpus_dict.get(w, 0.0) + 1.0

        # normalizing the dictionary
        length = float(len(list_of_words))
        for k in doc_dict:
            doc_dict[k] = doc_dict[k] / length

        # add the normalized document to the corpus
        self.documents.append([doc_name, doc_dict])

    def similarities(self, testDoc):
        """Returns a list of all the [docname, similarity_score] pairs relative to a
list of words.

        """
        document = re.sub(r'[^ ㄱ-ㅣ가-힣]', '', testDoc)
        okt = konlpy.tag.Okt()
        clean_words = list()
        for word in okt.pos(document, stem=True):
            if word[1] in ['Noun', 'Verb', 'Adjective']:
                clean_words.append(word[0])
        # building the query dictionary
        list_of_words = clean_words
        query_dict = {}
        for w in list_of_words:
            query_dict[w] = query_dict.get(w, 0.0) + 1.0

        # normalizing the query
        length = float(len(list_of_words))
        for k in query_dict:
            query_dict[k] = query_dict[k] / length

        # computing the list of similarities
        sims = []
        for doc in self.documents:
            score = 0.0
            doc_dict = doc[1]
            for k in query_dict:
                if k in doc_dict:
                    score += (query_dict[k] / self.corpus_dict[k]) + (
                      doc_dict[k] / self.corpus_dict[k])
            sims.append([doc[0], score])

        return sims
