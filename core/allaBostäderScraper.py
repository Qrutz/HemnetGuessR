# import sys
# import requests
# from bs4 import BeautifulSoup
# import scrapy
# from scrapy_splash import SplashRequest


# folder = "images"


# class MySpider(scrapy.Spider):
#     name = 'myspider'
#     start_urls = ['https://www.fastighetsbyran.com/sv/sverige/till-salu']

#     def parse(self, response='https://www.fastighetsbyran.com/sv/sverige/till-salu':
#         for link in response.css('a.overflow-hidden'):
#             href = link.css('::attr(href)').get()
#             yield {'href': href}


# # Example usage

# spider = MySpider()
# spider.start_requests()
# spider.parse("")
