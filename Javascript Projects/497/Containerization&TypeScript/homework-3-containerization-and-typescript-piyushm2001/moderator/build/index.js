"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var axios_1 = __importDefault(require("axios"));
var app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var wordList = ["one", "two", "three"];
app.post('/events', function (req, res) {
    var type = req.body.type;
    var data = req.body.data;
    if (type === "CommentCreated") {
        var id = data.id;
        var content = data.content;
        var postId = data.postId;
        var breakStatus = false;
        var comments = content.split(" ");
        for (var _i = 0, wordList_1 = wordList; _i < wordList_1.length; _i++) {
            var word = wordList_1[_i];
            for (var _a = 0, comments_1 = comments; _a < comments_1.length; _a++) {
                var comment = comments_1[_a];
                if (word.toLowerCase() === comment.toLowerCase()) {
                    axios_1.default.post('http://query:4002/events', {
                        type: 'CommentModerated',
                        data: {
                            id: id,
                            content: content,
                            postId: postId,
                            status: "(rejected)",
                        }
                    });
                    breakStatus = true;
                    break;
                }
            }
            if (breakStatus) {
                break;
            }
        }
        if (!breakStatus) {
            axios_1.default.post('http://query:4002/events', {
                type: 'CommentModerated',
                data: {
                    id: id,
                    content: content,
                    postId: postId,
                    status: "(accepted)",
                }
            });
        }
    }
    res.send({ status: 'OK' });
});
app.listen(4003, function () {
    console.log('Listening on 4003');
});
