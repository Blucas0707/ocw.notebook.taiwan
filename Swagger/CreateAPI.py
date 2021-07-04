import random
from flask import Flask, jsonify, request
from flasgger import Swagger

app = Flask(__name__)
Swagger(app)

@app.route('/api/user', methods=['GET'])
def index():
    """
    取得當前登入的使用者資訊
    ---
    tags:
      - 使用者
    responses:
      200:
        description: 已登入的使用者資料，null 表示未登入

        schema:
          properties:
            data:
              type: object
              properties:
                  id:
                    type: integer
                    example: 4
                  name:
                    type: string
                    example: Arthur Dent
                  email:
                    type: string
                    example: 123@gmail.com

      500:
        description: Error The language is not awesome!
    """

    language = language.lower().strip()
    features = [
        "awesome", "great", "dynamic",
        "simple", "powerful", "amazing",
        "perfect", "beauty", "lovely"
    ]
    size = int(request.args.get('size', 1))
    if language in ['php', 'vb', 'visualbasic', 'actionscript']:
        return "An error occurred, invalid language for awesomeness", 500
    return jsonify(
        language=language,
        features=random.sample(features, size)
    )


app.run(debug=True)