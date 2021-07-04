
from config import app

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/course/<id>")
def attraction(id):
	return render_template("course.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
# @app.route("/thankyou")
# def thankyou():
# 	return render_template("thankyou.html")


#使用者API
@app.route("/api/user", methods = ["GET","POST","PATCH","DELETE"])
def api_user():
	return get_api_user(app)

#旅遊景點API
@app.route("/api/attractions", methods = ["GET"])
def api_attractions():
	return get_api_attractions()

@app.route("/api/attraction/<attractionId>", methods = ["GET"])
def api_attractionId(attractionId):
	return get_api_attractionId(attractionId)

#訂單API
@app.route("/api/booking", methods = ["GET","POST","DELETE"])
def api_booking():
	return get_api_booking()

#付款API
@app.route("/api/orders", methods = ["POST"])
def api_orders():
	return get_api_orders()

@app.route("/api/order/<orderNumber>", methods = ["GET"])
def api_orders_number(orderNumber):
	return get_api_orders_number(orderNumber)



#error handle
@app.errorhandler(500)
def internal_error(error):
	return api_internal_error()

@app.errorhandler(404)
def not_found_error(error):
	return api_not_found_error()

@app.errorhandler(403)
def not_allowed_error(error):
	return api_not_allowed_error()

app.run(host="0.0.0.0", port=3000, debug = True)
# app.run(port=3000)


