var express = require('express');
var async = require('async');
var bodyParser = require('body-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');

var app = express();
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'keyboard cat'
}))
app.use(express.static('static'));
app.use(bodyParser.json());
var request = require('request');
var issueData = [

];

app.get('/api/issues', function(req, res) {
    res.json(issueData);
});
app.post('/api/sendEmail', function(req, res) {
    console.log('sendEmail');
    var transporter = nodemailer.createTransport({
        host: 'smtp.qupworld.com',
        port: 465,
        secure: true,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: req.body.auth.username,
            pass: req.body.auth.password
        }
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: req.body.auth.username, // sender address
        to: req.body.auth.sendTo
    };
    var userName = req.body.auth.username.split('@')[0];
    var name = userName.split('.');
    var date = new Date();
    var subject =  "["+userName+"] Weekly Report Date " + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    var content = "<!DOCTYPE html><html><head><style>table, th, td {font-family: 'Calibri', Calibri; font-size:11pt; border: 1px solid black; border-collapse: collapse;}</style></head><body>";
    content += "Hi anh,"+'<br>';
    content += "Em goi anh report tuan nay"+'<br><br>';
    content += "Tasks accomplished this week:"+'<br><br>';
    content += "<table><thead><tr><th>Task Description</th><th>Component</th><th>Expected result(% complete, Completed)</th><th>Version</th><th>Note</th></tr></thead><tbody>";
    var len1 = req.body.issues.issuesAccomplished.length;
    for (var i = 0 ; i < len1; i++) {
        content += "<tr><td>"+ req.body.issues.issuesAccomplished[i].summary+"</td><td>"+ req.body.issues.issuesAccomplished[i].component+"</td><td>"+ req.body.issues.issuesAccomplished[i].result+"</td><td>"+ req.body.issues.issuesAccomplished[i].version+"</td><td></td></tr>";
    }
    content += "</tbody></table>";

    content += "<br><br>Task to be done next week:"+'<br><br>';

    content += "<table ><thead><tr><th>Task Description</th><th>Component</th><th>Expected result(% complete, Completed)</th><th>Version</th><th>Note</th></tr></thead><tbody>";
    var len2 = req.body.issues.issuesPlan.length;
    for (var j = 0 ; j < len2; j++) {
        content += "<tr><td>"+ req.body.issues.issuesPlan[j].summary+"</td><td>"+ req.body.issues.issuesPlan[j].component+"</td><td>"+ req.body.issues.issuesPlan[j].result+"</td><td>"+ req.body.issues.issuesPlan[j].version+"</td><td></td></tr>";
    }
    content += "</tbody></table>";

    content += "<br>Thank anh,"+'<br></body></html>';
    mailOptions.subject = subject;
    mailOptions.html = content;
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log('Send Mail Report Fail:');
            console.log(error);
            res.json(error);
        } else  {
            res.json(info);
        }
    });

});
app.post('/api/addIssue', function(req, res) {
    if (req.session.user) {
        console.log('/api/addIssue: ' + req.body.key)
        request({
                url: 'https://issues.qup.vn/rest/api/2/issue/' + req.body.key,
                timeout: 30000,
                'auth': {
                    'user': req.session.user.username,
                    'pass': req.session.user.password
                }
            },
            function(error, response, result){
                console.log(error)
                if (!error && result) {
                    var body = JSON.parse(result);
                    if (body.fields) {
                        var tmp = {
                            key: body.key,
                            summary: body.fields.summary,
                            component: '',
                            version: '',
                            result: body.fields.status.name === 'In Progress' ? '50 %' : 'Completed',
                            note: ''
                        };
                        var componentLen = body.fields.components.length;
                        for (var j =0; j < componentLen; j++) {
                            tmp.component += tmp.component ? ', ' + body.fields.components[j].name : body.fields.components[j].name;
                        }
                        var versionLen = body.fields.versions.length;
                        for (var k =0; k < versionLen; k++) {
                            tmp.version += tmp.version ? ', ' + body.fields.versions[k].name : body.fields.versions[k].name;
                        }
                        res.json(tmp)
                    }
                } else {
                    res.json({})
                }
            })
    } else {
        res.json({})
    }

})
app.post('/api/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    async.parallel({
        issuesAccomplished: function(cback){
            request({
                    url: 'https://issues.qup.vn/rest/api/2/search?jql=project = QTX AND status in ("In Progress", Closed, "In Review", "In QA", "Resolved in DEMO", "Resolved in LAB") AND updated >= -1w AND assignee in ("'+username+'") ORDER BY updated DESC',
                    timeout: 10000,
                    'auth': {
                        'user': username,
                        'pass': password
                    }
                },
                function(error, response, result){
                    console.log(error)
                    if (!error && result) {
                        var body = JSON.parse(result);
                        if (body.issues && body.issues.length) {
                            req.session.user = {
                                username: username,
                                password: password
                            };
                            var len = body.issues.length;
                            var rs = [];
                            for (var i =0; i < len; i++) {
                                var tmp = {
                                    key: body.issues[i].key,
                                    summary: body.issues[i].fields.summary,
                                    component: '',
                                    version: '',
                                    result: body.issues[i].fields.status.name === 'In Progress' ? '50 %' : 'Completed',
                                    note: ''
                                };
                                var componentLen = body.issues[i].fields.components.length;
                                for (var j =0; j < componentLen; j++) {
                                    tmp.component += tmp.component ? ', ' + body.issues[i].fields.components[j].name : body.issues[i].fields.components[j].name;
                                }
                                var versionLen = body.issues[i].fields.versions.length;
                                for (var k =0; k < versionLen; k++) {
                                    tmp.version += tmp.version ? ', ' + body.issues[i].fields.versions[k].name : body.issues[i].fields.versions[k].name;
                                }
                                rs.push(tmp)
                            }
                            cback(null, rs);
                        } else {
                            cback(null, []);
                        }

                    } else {
                        res.json([])
                    }
                })
        },
        issuesPlan: function(cback){
            request({
                    url: 'https://issues.qup.vn/rest/api/2/search?jql=project = QTX AND status in (Open, "In Progress") AND updated >= -4w AND assignee in ("'+username+'") ORDER BY updated DESC',
                    timeout: 10000,
                    'auth': {
                        'user': username,
                        'pass': password
                    }
                },
                function(error, response, result){
                    console.log(error)
                    if (!error && result) {
                        var body = JSON.parse(result);
                        if (body.issues && body.issues.length) {
                            req.session.user = {
                                username: username,
                                password: password
                            };
                            var len = body.issues.length;
                            var rs = [];
                            for (var i =0; i < len; i++) {
                                var tmp = {
                                    key: body.issues[i].key,
                                    summary: body.issues[i].fields.summary,
                                    component: '',
                                    version: '',
                                    result: body.issues[i].fields.status.name === 'In Progress' ? '50 %' : 'Completed',
                                    note: ''
                                };
                                var componentLen = body.issues[i].fields.components.length;
                                for (var j =0; j < componentLen; j++) {
                                    tmp.component += tmp.component ? ', ' + body.issues[i].fields.components[j].name : body.issues[i].fields.components[j].name;
                                }
                                var versionLen = body.issues[i].fields.versions.length;
                                for (var k =0; k < versionLen; k++) {
                                    tmp.version += tmp.version ? ', ' + body.issues[i].fields.versions[k].name : body.issues[i].fields.versions[k].name;
                                }
                                rs.push(tmp)
                            }
                            cback(null, rs);
                        } else {
                            cback(null, []);
                        }

                    } else {
                        res.json([])
                    }
                })
        }
    }, function(err, rs){
        res.json(rs)
    })
});


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Started server at port", port);
});