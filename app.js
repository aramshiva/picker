var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var App = require("@slack/bolt").App;
require("dotenv").config();
var app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});
app.command("/pick", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
    var result, error_1;
    var command = _b.command, ack = _b.ack, client = _b.client, body = _b.body;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, ack()];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, client.views.open({
                        trigger_id: body.trigger_id,
                        view: {
                            type: "modal",
                            callback_id: "pick",
                            title: {
                                type: "plain_text",
                                text: "Picker",
                            },
                            blocks: [
                                {
                                    type: "input",
                                    block_id: "input",
                                    label: {
                                        type: "plain_text",
                                        text: "Reason",
                                    },
                                    element: {
                                        type: "plain_text_input",
                                        action_id: "reason_input",
                                        multiline: true,
                                    },
                                },
                            ],
                            submit: {
                                type: "plain_text",
                                text: "Submit",
                            },
                        },
                    })];
            case 3:
                result = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.view("pick", function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
    var channel, values, reason, response, members, _c, _d, picked, error_2;
    var ack = _b.ack, body = _b.body, client = _b.client;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, ack()];
            case 1:
                _e.sent();
                channel = body.channel;
                values = body.view.state.values;
                reason = values.input.reason_input.value;
                return [4 /*yield*/, fetch("https://slack.com/api/conversations.members?channel=".concat(channel, "&limit=100&pretty=1"), {
                        headers: {
                            Authorization: "Bearer ".concat(process.env.SLACK_BOT_TOKEN),
                            "Content-Type": "application/json",
                        },
                    })];
            case 2:
                response = _e.sent();
                _d = (_c = JSON).parse;
                return [4 /*yield*/, response.text()];
            case 3:
                members = _d.apply(_c, [_e.sent()]).members;
                picked = members[Math.floor(Math.random() * members.length)];
                _e.label = 4;
            case 4:
                _e.trys.push([4, 6, , 7]);
                return [4 /*yield*/, client.chat.postMessage({
                        channel: channel,
                        text: "Hey<@".concat(picked, ">! You have been picked for ").concat(reason),
                    })];
            case 5:
                _e.sent();
                return [3 /*break*/, 7];
            case 6:
                error_2 = _e.sent();
                console.log(error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Start your app
            return [4 /*yield*/, app.start(process.env.PORT || 3000)];
            case 1:
                // Start your app
                _a.sent();
                console.log("⚡️ Bolt app is running!");
                return [2 /*return*/];
        }
    });
}); })();
