from crawler_function import getData
import json
import datetime

class NTHU(getData):
    def __init__(self):
        self.base_url ="https://ocw.nthu.edu.tw/ocw/index.php?page=courseList&classid=0&order=time&maximum=50&year=&p="
        self.page = 1
        self.lastPage = -1
        self.total_count = 0
        self.data = {
            "university": "清華大學",
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
            print(f"NTHU page:{page}")
            soup = super().getWebContent(base_url=self.base_url, page = page)

            # judge last page or not
            courseList = soup.select("#ContentPage > div > div > div.courseListBlock > div:nth-child(1)")
            if not courseList:  # no course
                isContinue = False
                break

            #get all course list
            courseList = soup.find_all("div",{"class":"singleCourse row"})
            # print(courseList[0].find('div', {'class': 'courseDescription'}).p.span.span.text)

            index = 0
            for course in courseList:
                # print(index,course)
                index += 1
                data = {
                    "course_semester":"",
                    "course_department": "",
                    "course_category": "",
                    "course_establish": "",
                    "course_name": "",
                    "course_cover": "",
                    "course_teacher": "",
                    "course_description": "",
                    "course_link": "",
                    "course_lecture": ""
                }

                # course_semester
                data["course_semester"] = course.find('span',{'class':'courseNo'}).text.strip()[:3]
                # course_name
                data["course_name"] = course.find('span',{'class':'courseTitle'}).text.strip()
                # course_category
                course_category = course.find('span',{'class':'courseCategory'}).text.strip()
                if course_category in ["工程","自然科學"]:
                    data["course_category"] = "理工電資"

                    keywords = ["神經", "生物", "生命", "管理"]
                    for keyword in keywords:
                        if keyword in data["course_name"]:
                            data["course_category"] = "生農醫衛"
                            break

                elif course_category in ["人文社會"]:
                    data["course_category"] = "文史哲藝"

                    keywords = ["心理學","全球化","政治","管理"]
                    for keyword in keywords:
                        if keyword in data["course_name"] :
                            data["course_category"] = "法社管理"
                            break
                else:
                    data["course_category"] = "百家學堂"

                # course_img
                # base_url = """https://ocw.nthu.edu.tw/ocw/"""
                img = f"{course.find('div', {'class': 'thumbnail'}).img['src'][2:]}"
                data["course_cover"] = """https://ocw.nthu.edu.tw/ocw/""" + img
                # course_teacher
                data["course_teacher"] = course.find('span', {'class': 'courseTeacher'}).text.strip()[:-3]
                # course_link
                data["course_link"] = 'https://ocw.nthu.edu.tw/ocw/' + course.get('onclick')[13:-3]
                # course_description
                data["course_description"] = course.find('div', {'class': 'courseDescription'}).text.strip().replace(" ","")
                # course_lecture
                print(f"""NTHU course_link:{data['course_link']}""")
                (lecture,course_establish) = self.getCourse(url=data["course_link"])
                data["course_lecture"] = lecture
                # course_establish
                data["course_establish"] = course_establish


                #put data into self.data
                self.total_count += 1
                self.data["course"].append(data)
                self.data["total_course"] = self.total_count
            ## break for testing use
            #     break
            # break
            page += 1

            # save to json file
            with open("NTHU.json","w") as file:
                file.write(json.dumps(self.data, indent=4, sort_keys=False, ensure_ascii=False))
        #close file
        file.close()

        # exec status
        isSuccessed = True

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
            message = f""" [Crawler][清華大學] Get course list """ + status + f""" and duration = {Duration}\n"""
            existing_content = log.read()
            log.seek(0, 0)
            log.write(exec_time + message + existing_content)
            log.close()

    def getCourse(self,url = None):
        # print(f"url ={url}")
        #get the course page info
        base_url = url
        # base_url = "https://ocw.nthu.edu.tw/ocw/index.php?page=course&cid=20&"
        soup = super().getWebContent(base_url=base_url)
        # print(soup)
        # print(soup.prettify())

        # #取得lecture link & names
        lectures = []
        lecture_names = []
        lecture_list = soup.find(id= "search2").ul.find_all("li")
        # print(lecture_list)
        lecture_base_url = "https://ocw.nthu.edu.tw/ocw/"
        for lecture in lecture_list:
            #lecture links
            lecture_link = lecture_base_url + lecture.a["href"]
            lectures.append(lecture_link)
            #lecture name
            lecture_name = lecture.text
            # print(lecture_name)
            lecture_names.append(lecture_name)
        # print(lecture_names)
        #取得課程上架時間
        lecture_update = soup.find(id= "search").find_all("ul")
        course_establish = lecture_update[-1].li.text.strip().split("上架日期: ")[1][:7] #只取YYYY-MM

        #定義lecture lecture data type
        data_dict = {
            "lecture_total": 0,
            "lecture": []
        }
        lecture_actual_id = 1
        #依序取得lecture link 中的video & note
        for index in range(len(lectures)):
            course_link = lectures[index]
            print(f"NTHU lecture_link:{course_link}")
            # print(f"course_name:{lecture_names[index]}")
            soup = super().getWebContent(base_url=course_link)
            # print(soup)
            data = {
                "lecture_id":"",
                "lecture_name":"",
                "lecture_video": [],
                "lecture_note": [],
                "lecture_reference": []
            }

            #取得lecture_note link
            notes_link = []
            info_downloads = soup.find(id = "search").find_all("h2")
            for info in info_downloads:
                if info.text.strip() == "資料下載": # 有“資料下載”存在
                    notes = info.find_next_sibling("ul").find_all("li")
                    # print(notes)
                    for note in notes:
                        # print(note,type(note))
                        note_link = lecture_base_url + note.a["href"]
                        # print(note_link)
                        notes_link.append(note_link)
            #取得lecture video link
            try:
                class_videos = soup.find_all("div", {"class": "col-md-4 singleItem"})
            except:
                class_videos = []

            for course_index in range(len(class_videos)):
                class_video = class_videos[course_index]
                class_video_links = class_video.find_all("a")
                try:
                    class_video_link = class_video_links[-1]["href"].replace(";", "&")
                except:
                    class_video_link = []
                # print(f"class_video_link:{class_video_link}")
                # print("\n")
                data = {
                    "lecture_id": "",
                    "lecture_name": "",
                    "lecture_video": [],
                    "lecture_note": [],
                    "lecture_reference": []
                }

                # lecture No. & name
                data["lecture_id"] = lecture_actual_id
                data["lecture_name"] = lecture_names[index].strip() + "-" + str(course_index + 1)
                # videos
                data["lecture_video"] = [class_video_link]
                # notes
                data["lecture_note"] = notes_link
                # references
                data["lecture_reference"] = []
                # print("data: " +data["lecture_name"])
                lecture_actual_id += 1
                data_dict["lecture"].append(data)

            data_dict["lecture_total"] = len(data_dict["lecture"])

        # print(data_dict)
        return (data_dict,course_establish)



NTHU = NTHU()
