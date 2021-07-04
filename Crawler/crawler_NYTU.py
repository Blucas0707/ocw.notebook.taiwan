from crawler_function import getData
import json
import datetime
from dotenv import dotenv_values
#load .env config
config = dotenv_values("../../key/.env")

class NYTU(getData):
    def __init__(self):
        self.base_url ="https://ocw.nctu.edu.tw/course_list_search.php?page="
        self.page = 1
        self.lastPage = -1
        self.total_count = 0
        self.data = {
            "university": "陽明交通大學",
            "total_course":self.total_count,
            "course": []
        }

    # def getWebContent(self, base_url = None, page = None):
    #     web_url = base_url + str(page)
    #     my_headers = {'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36'}
    #     req = requests.get(web_url, headers = my_headers)
    #     req.encoding = "utf-8"
    #     soup = BeautifulSoup(req.text, "html.parser")
    #     return soup

    def CourseList(self):
        # crawler start time
        startTime = datetime.datetime.now()

        # execu status
        isSuccessed = False
        page = 1
        isContinue = True
        while isContinue:
            print(f"NYTU page:{page}")
            soup = super().getWebContent(base_url=self.base_url,page = page)
            # judge last page or not
            courseList = soup.find("div",{"class":"course-list visible-xs visible-sm"})

            # check no course => last page
            if not courseList:
                isContinue = False
                break

            #get all course list
            courseList = soup.find_all("div",{"class":"course-list visible-xs visible-sm"})
            # print(courseList[0].find('div', {'class': 'courseDescription'}).p.span.span.text)

            for course in courseList:
                data = {
                    "course_semester":"",
                    "course_department": "",
                    "course_category": "",
                    "course_establish": "",
                    "course_name": "",
                    "course_cover": "",
                    "course_teacher": "",
                    "course_link": "",
                    "course_description": ""
                }

                # course_name
                data["course_name"] = course.find('div',{'class':'course-heading col-xs-10'}).h3.a.text.strip()
                # course_teacher
                data["course_teacher"] = course.find('div', {'class': 'course-info col-xs-12'}).text.strip()
                # course_link
                base_url = """https://ocw.nctu.edu.tw/"""
                data["course_link"] = base_url + course.find('div', {'class': 'course-info col-xs-12'}).parent.a["href"]

                # get semester & description
                content = super().getWebContent(base_url=data["course_link"])
                # course_semester
                data["course_semester"] = str(content.find('table',{'class':'table table-bordered table-striped'}).tr.findNext("tr").findNext("tr").td.text.split("學年度")[0]).zfill(3) + "00"
                # print(data["course_semester"])
                # course_description
                p_siblings = content.find('div',{'class':'fb-like'}).find_next_siblings("p")
                description = ""
                for p_sibling in p_siblings:
                    description += p_sibling.text.strip().replace('\n', '').replace('\r', ' ')
                # print(description)
                data["course_description"] = description

                # course_lecture
                print(f"""NYTU course_link:{data["course_link"]}""")
                (lecture,course_establish,course_cover) = self.getCourse(url=data["course_link"])
                data["course_lecture"] = lecture
                # course_establish
                data["course_establish"] = course_establish
                # course_cover
                data["course_cover"] = course_cover
                # course_category
                category = int(data["course_link"].split("bgid=")[1].split("&")[0])
                if category in [5,10]:
                    data["course_category"] = "文史哲藝"
                elif category in [3,27]:
                    data["course_category"] = "法社管理"
                elif category in [1,2,9,8]:
                    data["course_category"] = "理工電資"
                elif category in [4]:
                    data["course_category"] = "生農醫衛"
                else:
                    data["course_category"] = "百家學堂"


                #
                self.total_count += 1
                self.data["course"].append(data)
                self.data["total_course"] = self.total_count
            #### break for testing use
            #     break
            # break
            page += 1

            #save to json file
            with open("NYTU.json","w") as file:
                file.write(json.dumps(self.data, indent=4, sort_keys=False, ensure_ascii=False))
        # close file
        file.close()

        #exec status
        isSuccessed = True

        #crawler end Time
        endTime = datetime.datetime.now()
        Duration = endTime - startTime
        print(f"Duration: {Duration}")

        # write in log
        file_path = ""
        file = file_path + "log.txt"
        with open(file, "r+") as log:
            if isSuccessed:
                status = "success"
            else:
                status = "fail"
            exec_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            message = f""" [Crawler][陽明交通大學] Get course list """ + status + f""" and duration = {Duration}\n"""
            existing_content = log.read()
            log.seek(0, 0)
            log.write(exec_time + message + existing_content)
            log.close()



    def getCourse(self,url = None,lecture_reference= []):
        #get the course page info

        base_url = url.replace("course_detail","course_detail-v")
        soup = super().getWebContent(base_url=base_url)

        data_dict = {
            "lecture_total": "",
            "lecture": []
        }

        try:
            lecture_table = soup.find("table", {"class": "table table-bordered table-striped"}).find_all("tr")

            #取得 lecture_name, lecture_video_link, lecture_cover
            if len(lecture_table) > 1: #not only title
                for index in range(1, len(lecture_table)):
                    data = {
                        "lecture_id": "",
                        "lecture_name": "",
                        "lecture_video": [],
                        "lecture_note": [],
                        "lecture_reference": []
                    }

                    lectures = lecture_table[index].find_all("td")
                    lecture_id = index
                    lecture_name = lectures[1].text.strip().replace('\n', '').replace('\r', ' ')
                    lecture_video_youtube_id = lectures[2].a["href"].split("=")[-1]
                    lecture_video = lectures[2].find_all("a")[-1]["href"]
                    if index == 1:
                        #課程封面, 上傳時間
                        lecture_cover = "https://i.ytimg.com/vi/" + lecture_video_youtube_id + "/hqdefault.jpg"
                        YOUTUBE_API_KEY = config["YOUTUBE_API_KEY"]
                        youtube_api_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id="+ lecture_video_youtube_id +"&key=" + YOUTUBE_API_KEY
                        establish_soup = self.getWebContent(base_url=youtube_api_url)
                        # print(establish_soup)
                        establish = json.loads(establish_soup.text)["items"][0]["snippet"]["publishedAt"][:7]
                        # print(establish)
                    # print(lecture_name, lecture_video, lecture_cover)
                    lecture_note = []
                    lecture_reference = lecture_reference

                    # id
                    data["lecture_id"] = lecture_id
                    # name
                    data["lecture_name"] = lecture_name
                    # videos
                    data["lecture_video"] = [lecture_video]
                    # notes
                    data["lecture_note"] = lecture_note
                    # references
                    data["lecture_reference"] = lecture_reference
                    # dlecture_total

                    # print(data)
                    data_dict["lecture"].append(data)
            else:
                data = {
                    "lecture_id": "",
                    "lecture_name": "",
                    "lecture_video": "",
                    "lecture_note": [],
                    "lecture_reference": []
                }
                establish = ""
                lecture_cover = ""
                data_dict["lecture"].append(data)

        except:
            data = {
                "lecture_id": "",
                "lecture_name": "",
                "lecture_video": [],
                "lecture_note": [],
                "lecture_reference": []
            }
            establish = ""
            lecture_cover = ""
            data_dict["lecture"].append(data)

        data_dict["lecture_total"] = len(data_dict["lecture"])

        return (data_dict,establish,lecture_cover)

NYTU = NYTU()