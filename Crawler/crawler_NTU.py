from crawler_function import getData
# from Models.RDS_SQL import RDS
import requests
from bs4 import BeautifulSoup
import json
import datetime
import os

class NTU(getData):
    def __init__(self):
        self.base_url ="http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/coupage/"
        self.page = 1
        self.lastPage = -1
        self.total_count = 0
        self.data = {
            "university":"台灣大學",
            "total_course": self.total_count,
            "course": []
        }

    def latest_course(self):
        #get file modify time
        NTU_JSON = os.path.getmtime("NTU.json")
        last_update_time = datetime.datetime.fromtimestamp(NTU_JSON).strftime('%Y/%m/%d')
        print(f"last_update_time: {last_update_time}")

        #get latest course
        page = "http://ocw.aca.ntu.edu.tw/ntu-ocw/recent-acts"
        my_headers = {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36'
        }
        req = requests.get(page, headers = my_headers)
        soup = BeautifulSoup(req.text, "html.parser")
        courseboxes = soup.find_all("div",{"class":"coursebox"})
        for coursebox in courseboxes:
            #get course name
            course_name = coursebox.find("div", {"class": "coursetitle"})
            if not course_name:
                course_name = coursebox.find("div", {"class": "eng-coursetitle"})
            course_name = course_name.text
            #get course update time
            course_update_time = coursebox.find("div",{"class":"introtext"}).text.strip().split(" ")[0]
            #get course link
            course_link = coursebox.a["href"]
            print(course_name,course_update_time,course_link)

    def CourseList(self):
        #crawler start time
        startTime = datetime.datetime.now()
        #get last page
        # self.getLastPage()
        #execu status
        isSuccessed = False

        #get all category
        category_pages = ["category/1", "category/2", "category/3", "category/4", "new-intellectuals"]
        all_category = []
        count = 0
        for category_page in category_pages:
            web_url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/" + str(category_page)
            my_headers = {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36'
            }
            req = requests.get(web_url, headers=my_headers, timeout=60)
            req.encoding = "utf-8"
            soup = BeautifulSoup(req.text, "html.parser")
            if category_page != "new-intellectuals":
                category_courses = soup.find(id="home-tab" + str(category_pages.index(category_page) + 1)).find_all(
                    "div", {"class": "coursetitle"})
            else:
                category_courses = soup.find(id="coubox5").find_all("div", {"class": "coursetitle"})
            temp = []
            for category_course in category_courses:
                temp.append(category_course.text.strip())
            all_category.append(temp)
            # count += len(temp)
        # all_category[0]:文史哲藝,[1]:法社管理,[2]:理工電資,[3]:生農醫術,[4]:百家學堂

        page = 1
        isContinue = True
        while isContinue:
            print(f"NTU page:{page}")
            soup = super().getWebContent(base_url=self.base_url, page=page)
            # print(f"NTU page:{page}")
            # if page > self.lastPage:
            #     isContinue = False
            #     break

            # judge last page or not
            courseList = soup.find("div",{"class":"coursebox"})
            if not courseList:  # no course
                isContinue = False
                break

            # print(f"page:{page}")
            soup = super().getWebContent(base_url=self.base_url, page = page)
            coursebox = soup.find_all("div",{"class":"coursebox"})
            # print(coursebox[0])
            for index in range(len(coursebox)): #len(coursebox)
                course = coursebox[index]
                # print(course)
                data = {
                    "course_semester":"",
                    "course_department":"",
                    "course_category": "",
                    "course_establish":"",
                    "course_name": "",
                    "course_cover": "",
                    "course_teacher": "",
                    "course_description": "",
                    "course_link": "",
                    "course_lecture":""
                }
                # course_name
                try:
                    data["course_name"] = course.find("div",{"class":"coursetitle"}).a.text
                except:
                    data["course_name"] = course.find("div", {"class": "eng-coursetitle"}).a.text

                # course_category
                if data["course_name"] in all_category[0]:
                    data[ "course_category"] = "文史哲藝"
                elif data["course_name"] in all_category[1]:
                    data[ "course_category"] = "法社管理"
                elif data["course_name"] in all_category[2]:
                    data[ "course_category"] = "理工電資"
                elif data["course_name"] in all_category[3]:
                    data[ "course_category"] = "生農醫衛"
                else:
                    data[ "course_category"] = "百家學堂"

                # course_img
                data["course_cover"] = course.find("img")["src"]
                # course_teacher
                data["course_teacher"] = str(course.find("div", {"class": "teacher"}).text).strip()
                # course_link
                data["course_link"] = course.a["href"]
                # course_semester
                data["course_semester"] = course.a["href"][-7:-4].replace("S","0")
                #course_lecture
                print(f"""NTU course_link:{data['course_link']}""")
                (lecture,description,department,establish) = self.getCourse(url = data["course_link"] )
                data["course_lecture"] = lecture
                # course_description
                data["course_description"] = description
                # course_department
                data["course_department"] = department
                # course_establish
                # print(f"establish:{establish}")
                if establish:
                    year = establish.split("年")[0].strip()
                    month = establish.split("年")[1].split("月")[0].strip().zfill(2)
                    data["course_establish"] = year + "-" + month
                else:
                    data["course_establish"] = establish
                # print(data["course_establish"])
                #
                self.total_count += 1
                self.data["course"].append(data)
                self.data["total_course"] = self.total_count
            #### break for testing use
                # break
            page += 1

            #save to json file
            with open("NTU.json","w+") as file:
                file.write(json.dumps(self.data, indent=4, sort_keys=False, ensure_ascii=False))
                # print("SAVE")
            #close file
            file.close()

            # 由於http 所以只爬一頁，放S3
            break

        # exec status
        isSuccessed = True
        #crawler end Time
        endTime = datetime.datetime.now()
        Duration = endTime - startTime
        print(f"Duration: {Duration}")

        #write in log
        file_path = ""
        file = file_path + "log.txt"
        with open(file, "r+") as log:
            if isSuccessed:
                status = "success"
            else:
                status = "fail"
            exec_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            message = f""" [Crawler][台灣大學] Get course list """ + status + f""" and duration = {Duration}\n"""
            existing_content = log.read()
            log.seek(0,0)
            log.write(exec_time + message + existing_content)
            log.close()



    def getCourse(self,url = None): #course detail info
        # print(f"url ={url}")
        # url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/102S112"
        #get description
        description_url = url.replace("cou","cou_intro")
        # print(description_url)
        soup = super().getWebContent(base_url=description_url)
        try:
            # ex: http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou_intro/099S113
            story = soup.find("div",{"class":"story"}).find_all("p")
            # [1].text.strip()
            # print(story)

            # description
            try:
                description = story[1].text.strip().replace("\n","").replace("\r","")
            except:
                description = ""
            #department & establish
            try:
                course_infos = story[0].find_all("strong")
                # print(f"course_infos:{course_infos}")
                for index in range(len(course_infos)):
                    course_info = course_infos[index]
                    # print(f"course_info.text:{course_info.text},len(course_infos):{len(course_infos)}")
                    if course_info:
                        if course_info.text =="開課單位：":
                            try:
                                department = course_info.next_sibling.strip()
                            except:
                                department = ""
                            # print(department)
                        if course_info.text =="建立日期：":
                            try:
                                establish = course_info.next_sibling.strip()
                            except:
                                establish = ""
            except:
                department = ""
                establish = ""
        except:
            description = ""
            department = ""
            establish = ""

        # print(description ,department, establish)
        #get the course page info

        base_url = url + "/"
        page = 1
        # base_url = "http://ocw.aca.ntu.edu.tw/ntu-ocw/ocw/cou/099S113/1"
        soup = super().getWebContent(base_url=base_url, page=page)

        # print(soup.prettify())
        #取得lecture Number
        lectures = []
        lecture_names = []
        lecture_list = soup.find_all("div",{"class":"AccordionPanel"})
        for lecture in lecture_list:
            #lecture id
            lectures.append(lecture["id"][3:])
            #lecture name
            name = lecture.div.div.text.strip()
            lecture_names.append(name)
        # print(lectures,lecture_names)

        data_dict = {
            "lecture_total": "courseNumber",
            "lecture": []
        }
        lecture_actual_id = 1

        for index in range(len(lectures)):
            lecture = lectures[index]
            # print(f"lecture = {lecture},base_url = {base_url}")
            soup = super().getWebContent(base_url=base_url, page=lecture)
            data = {
                "lecture_id":"",
                "lecture_name":"",
                "lecture_video": [],
                "lecture_note": [],
                "lecture_reference": []
            }

            #lecture video & classnote
            files = soup.find("div", {"class": "classnote"}).ul.find_all("li")
            videos = []
            notes = []
            references = []
            for file in files:
                if "觀看影音檔" in file.text: #video exist
                    #099S115_GE01V01
                    video_web_url = file.a["href"]
                    soup = self.getWebContent(base_url=video_web_url)
                    try:
                        video_link = soup.find("div",{"class":"video"}).a["href"]
                        videos.append(video_link)
                    except:
                        video_link = ""
                elif "下載講義" in file.text: # note exist
                    note_url = file.a["href"]
                    notes.append(note_url)
                elif "下載參考檔" in file.text: # note exist
                    reference_url = file.a["href"]
                    references.append(reference_url)

            if len(videos) > 1:#一堂課有多個影片
                for course_index in range(len(videos)):
                    data = {
                        "lecture_id": "",
                        "lecture_name": "",
                        "lecture_video": [],
                        "lecture_note": [],
                        "lecture_reference": []
                    }
                    # print(f"course_index:{course_index}")
                    # lecture No. & name
                    data["lecture_id"] = lecture_actual_id
                    data["lecture_name"] = lecture_names[index] + "-" + str(course_index+1)
                    # videos
                    data["lecture_video"] = [videos[course_index]]
                    # notes
                    data["lecture_note"] = notes
                    # references
                    data["lecture_reference"] = references
                    # print(videos,notes,references)
                    # print(data["lecture_name"])
                    lecture_actual_id += 1
                    # print(f"many data:{data} \n")
                    data_dict["lecture"].append(data)
                    # print(f"\n\n\n\nmany data_dict:{data_dict} \n")

            else:
                # lecture No. & name
                data["lecture_id"] = lecture_actual_id
                data["lecture_name"] = lecture_names[index]
                #videos
                data["lecture_video"] = videos
                #notes
                data["lecture_note"] = notes
                #references
                data["lecture_reference"] = references
                lecture_actual_id += 1
                data_dict["lecture"].append(data)
                # print(f"data:{data} \n")
            # print(f"data_dict:{data_dict} \n")
            data_dict["lecture_total"] = len(data_dict["lecture"])
        return (data_dict,description,department,establish)

NTU = NTU()
