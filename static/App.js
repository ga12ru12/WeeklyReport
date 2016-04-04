"use strict";

var session = {};
var LoginForm = React.createClass({
    displayName: "LoginForm",

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { name: "loginForm" },
                "Jira account: ",
                React.createElement("input", { type: "text", name: "username", placeholder: "vinh.tran" }),
                React.createElement("input", { type: "password", name: "password", placeholder: "password" }),
                React.createElement(
                    "button",
                    { onClick: this.handleSubmit },
                    "Login and get issues"
                )
            )
        );
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.loginForm;
        this.props.doLogin({ username: form.username.value, password: form.password.value });
    }
});
var SendEmail = React.createClass({
    displayName: "SendEmail",

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { name: "sendEmailForm" },
                "From:",
                React.createElement("input", { type: "text", name: "username", placeholder: "vinh.tran@qupworld.com" }),
                React.createElement("input", { type: "password", name: "password", placeholder: "password" }),
                "To:",
                React.createElement("input", { type: "text", name: "sendTo", placeholder: "phap.phan@qupworld.com" }),
                React.createElement(
                    "button",
                    { onClick: this.handleSubmit },
                    "SendEmail"
                )
            )
        );
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.sendEmailForm;
        this.props.doSendEmail({ username: form.username.value, password: form.password.value, sendTo: form.sendTo.value });
    }
});
var IssueRow = React.createClass({
    displayName: "IssueRow",

    render: function render() {
        var self = this;
        console.log("Rendering IssueRow:", this.props.issue);
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                this.props.issue.key
            ),
            React.createElement(
                "td",
                null,
                this.props.issue.summary
            ),
            React.createElement(
                "td",
                null,
                this.props.issue.component
            ),
            React.createElement(
                "td",
                null,
                this.props.issue.result
            ),
            React.createElement(
                "td",
                null,
                this.props.issue.version
            ),
            React.createElement(
                "td",
                null,
                React.createElement(
                    "button",
                    { id: this.props.issue.key, type: "button", className: "remove-item", onClick: this.handleSubmit },
                    "Remove"
                )
            )
        );
    },
    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        console.log(e.target.id);
        this.props.doRemove({ key: e.target.id });
    }
});

var TasksAccomplishedTable = React.createClass({
    displayName: "TasksAccomplishedTable",

    render: function render() {
        var that = this;
        console.log("Rendering issue table, num items:", this.props.issuesAccomplished.length);
        var issueRows = this.props.issuesAccomplished.map(function (issue) {
            return React.createElement(IssueRow, { doRemove: that.doRemove, key: issue.key, issue: issue });
        });
        return React.createElement(
            "table",
            null,
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Key"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Task Description"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Component"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Expected result(% complete, Completed)"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Version"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Note"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                issueRows
            )
        );
    },
    doRemove: function doRemove(data) {
        this.props.doRemove1(data);
    }
});
var TasksPlanTable = React.createClass({
    displayName: "TasksPlanTable",

    render: function render() {
        var that = this;
        var issueRows = this.props.issuesPlan.map(function (issue) {
            return React.createElement(IssueRow, { doRemove: that.doRemove, key: issue.key, issue: issue });
        });
        return React.createElement(
            "table",
            null,
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Key"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Task Description"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Component"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Expected result(% complete, Completed)"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Version"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Note"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                issueRows
            )
        );
    },
    doRemove: function doRemove(data) {
        this.props.doRemove2(data);
    }
});
var IssueAdd = React.createClass({
    displayName: "IssueAdd",

    render: function render() {
        console.log("Rendering IssueAdd");
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { name: "issueAdd" },
                React.createElement("input", { type: "text", name: "key", placeholder: "QTX-1000" }),
                React.createElement(
                    "button",
                    { onClick: this.handleList1Submit },
                    "Add Issue To List 1"
                ),
                React.createElement(
                    "button",
                    { onClick: this.handleList2Submit },
                    "Add Issue To List 2"
                )
            )
        );
    },

    handleList1Submit: function handleList1Submit(e) {
        e.preventDefault();
        var form = document.forms.issueAdd;
        if (form.key.value && form.key.value.length) {
            this.props.addIssue1({ key: form.key.value });
            // clear the form for the next input
            form.key.value = "";
        }
    },
    handleList2Submit: function handleList2Submit(e) {
        e.preventDefault();
        var form = document.forms.issueAdd;
        if (form.key.value && form.key.value.length) {
            this.props.addIssue2({ key: form.key.value });
            // clear the form for the next input
            form.key.value = "";
        }
    }
});
var IssueList = React.createClass({
    displayName: "IssueList",

    getInitialState: function getInitialState() {
        return {
            issuesAccomplished: [],
            issuesPlan: []
        };
    },
    render: function render() {
        console.log("Rendering issue list, num items:", this.state.issuesAccomplished.length);
        return React.createElement(
            "div",
            null,
            React.createElement(LoginForm, { doLogin: this.doLogin }),
            React.createElement("hr", null),
            React.createElement(
                "h3",
                null,
                "Tasks accomplished this week:"
            ),
            React.createElement(TasksAccomplishedTable, { doRemove1: this.doRemove1, issuesAccomplished: this.state.issuesAccomplished }),
            React.createElement("hr", null),
            React.createElement(
                "h3",
                null,
                "Task to be done next week:"
            ),
            React.createElement(TasksPlanTable, { doRemove2: this.doRemove2, issuesPlan: this.state.issuesPlan }),
            React.createElement("hr", null),
            React.createElement(IssueAdd, { addIssue1: this.addIssue1, addIssue2: this.addIssue2 }),
            React.createElement("hr", null),
            React.createElement(
                "h3",
                null,
                "Send Email:"
            ),
            React.createElement(SendEmail, { doSendEmail: this.doSendEmail })
        );
    },
    doSendEmail: function doSendEmail(auth) {
        console.log("doSendEmail ");
        $.ajax({
            type: 'POST', url: '/api/sendEmail', contentType: 'application/json',
            data: JSON.stringify({
                auth: auth,
                issues: this.state
            }),
            success: function success(data) {
                console.log('OK');
                alert(data);
            },
            error: function error(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    componentDidMount: function componentDidMount() {
        //$.ajax('/api/issuesAccomplished').done(function(data) {
        //    this.setState({issuesAccomplished: data});
        //}.bind(this));
        // In production, we'd also handle errors.
    },
    addIssue1: function addIssue1(issue) {
        console.log("Adding issue:", issue);
        $.ajax({
            type: 'POST', url: '/api/addIssue', contentType: 'application/json',
            data: JSON.stringify(issue),
            success: (function (data) {
                //// We're advised not to modify the state, it's immutable. So, make a copy.
                var issuesAccomplishedModified = this.state.issuesAccomplished.concat(data);
                this.setState({ issuesAccomplished: issuesAccomplishedModified });
            }).bind(this),
            error: function error(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    addIssue2: function addIssue2(issue) {
        console.log("Adding issue:", issue);
        $.ajax({
            type: 'POST', url: '/api/addIssue', contentType: 'application/json',
            data: JSON.stringify(issue),
            success: (function (data) {
                //// We're advised not to modify the state, it's immutable. So, make a copy.
                var issuesPlanModified = this.state.issuesPlan.concat(data);
                this.setState({ issuesPlan: issuesPlanModified });
            }).bind(this),
            error: function error(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    doLogin: function doLogin(auth) {
        console.log("doLogin issue:");
        $.ajax({
            type: 'POST', url: '/api/login', contentType: 'application/json',
            data: JSON.stringify(auth),
            success: (function (data) {
                var issue = data;
                // We're advised not to modify the state, it's immutable. So, make a copy.
                var issuesAccomplishedModified = this.state.issuesAccomplished.concat(issue.issuesAccomplished);
                var issuesPlanModified = this.state.issuesPlan.concat(issue.issuesPlan);
                this.setState({
                    issuesAccomplished: issuesAccomplishedModified,
                    issuesPlan: issuesPlanModified
                });
            }).bind(this),
            error: function error(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    doRemove1: function doRemove1(data) {
        this.state.issuesAccomplished = _.without(this.state.issuesAccomplished, _.findWhere(this.state.issuesAccomplished, { key: data.key }));
        this.setState(this.state.issuesAccomplished);
    },
    doRemove2: function doRemove2(data) {
        this.state.issuesPlan = _.without(this.state.issuesPlan, _.findWhere(this.state.issuesPlan, { key: data.key }));
        this.setState(this.state.issuesPlan);
    }
});
ReactDOM.render(React.createElement(IssueList, null), document.getElementById('main'));