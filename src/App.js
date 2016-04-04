var session = {};
var LoginForm = React.createClass({
    render: function() {
        return (
            <div>
                <form name="loginForm">
                    Jira account: <input type="text" name="username" placeholder="vinh.tran"/>
                    <input type="password" name="password" placeholder="password"/>
                    <button onClick={this.handleSubmit}>Login and get issues</button>
                </form>
            </div>
        )
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var form = document.forms.loginForm;
        this.props.doLogin({username: form.username.value, password: form.password.value});
    }
});
var SendEmail = React.createClass({
    render: function() {
        return (
            <div>
                <form name="sendEmailForm">
                    From:<input type="text" name="username" placeholder="vinh.tran@qupworld.com"/>
                    <input type="password" name="password" placeholder="password"/>
                    To:<input type="text" name="sendTo" placeholder="phap.phan@qupworld.com"/>
                    <button onClick={this.handleSubmit}>SendEmail</button>
                </form>
            </div>
        )
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var form = document.forms.sendEmailForm;
        this.props.doSendEmail({username: form.username.value, password: form.password.value, sendTo:  form.sendTo.value});
    }
});
var IssueRow = React.createClass({
    render: function() {
        var self = this;
        console.log("Rendering IssueRow:", this.props.issue);
        return (
            <tr>
                <td>{this.props.issue.key}</td>
                <td>{this.props.issue.summary}</td>
                <td>{this.props.issue.component}</td>
                <td>{this.props.issue.result}</td>
                <td>{this.props.issue.version}</td>
                <td><button id={this.props.issue.key} type="button" className="remove-item" onClick={this.handleSubmit}>Remove</button></td>
            </tr>
        )
    },
    handleSubmit: function(e) {
        e.preventDefault();
        console.log(e.target.id)
        this.props.doRemove({key: e.target.id});
    }
});

var TasksAccomplishedTable = React.createClass({
    render: function() {
        var that = this;
        console.log("Rendering issue table, num items:", this.props.issuesAccomplished.length);
        var issueRows = this.props.issuesAccomplished.map(function(issue) {
            return <IssueRow  doRemove={that.doRemove} key={issue.key} issue={issue} />
        });
        return (
            <table >
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Task Description</th>
                        <th>Component</th>
                        <th>Expected result(% complete, Completed)</th>
                        <th>Version</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
          {issueRows}
                </tbody>
            </table>
        )
    },
    doRemove:function(data) {
        this.props.doRemove1(data);
    }
});
var TasksPlanTable = React.createClass({
    render: function() {
        var that = this;
        var issueRows = this.props.issuesPlan.map(function(issue) {
            return <IssueRow  doRemove={that.doRemove} key={issue.key} issue={issue} />
        });
        return (
            <table >
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Task Description</th>
                        <th>Component</th>
                        <th>Expected result(% complete, Completed)</th>
                        <th>Version</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
          {issueRows}
                </tbody>
            </table>
        )
    },
    doRemove:function(data) {
        this.props.doRemove2(data);
    }
});
var IssueAdd = React.createClass({
    render: function() {
        console.log("Rendering IssueAdd");
        return (
            <div>
                <form name="issueAdd">
                    <input type="text" name="key" placeholder="QTX-1000" />
                    <button onClick={this.handleList1Submit}>Add Issue To List 1</button>
                    <button onClick={this.handleList2Submit}>Add Issue To List 2</button>
                </form>
            </div>
        )
    },

    handleList1Submit: function(e) {
        e.preventDefault();
        var form = document.forms.issueAdd;
        if (form.key.value && form.key.value.length) {
            this.props.addIssue1({key: form.key.value});
            // clear the form for the next input
            form.key.value = "";
        }

    },
    handleList2Submit: function(e) {
        e.preventDefault();
        var form = document.forms.issueAdd;
        if (form.key.value && form.key.value.length) {
            this.props.addIssue2({key: form.key.value});
            // clear the form for the next input
            form.key.value = "";
        }

    }
});
var IssueList = React.createClass({
    getInitialState: function() {
        return {
            issuesAccomplished: [],
            issuesPlan: []
        };
    },
    render: function() {
        console.log("Rendering issue list, num items:", this.state.issuesAccomplished.length);
        return (
            <div>
                <LoginForm doLogin={this.doLogin} />
                <hr />
                <h3>Tasks accomplished this week:</h3>
                <TasksAccomplishedTable doRemove1={this.doRemove1}  issuesAccomplished={this.state.issuesAccomplished}/>
                <hr />
                <h3>Task to be done next week:</h3>
                <TasksPlanTable doRemove2={this.doRemove2} issuesPlan={this.state.issuesPlan}/>
                <hr />
                <IssueAdd addIssue1={this.addIssue1} addIssue2={this.addIssue2} />
                <hr />
                <h3>Send Email:</h3>
                <SendEmail doSendEmail={this.doSendEmail}/>

            </div>
        )
    },
    doSendEmail: function(auth){
        console.log("doSendEmail ");
        $.ajax({
            type: 'POST', url: '/api/sendEmail', contentType: 'application/json',
            data: JSON.stringify({
                auth:auth,
                issues: this.state
            }),
            success: function(data) {
                console.log('OK');
                alert(data);
            },
            error: function(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    componentDidMount: function() {
        //$.ajax('/api/issuesAccomplished').done(function(data) {
        //    this.setState({issuesAccomplished: data});
        //}.bind(this));
        // In production, we'd also handle errors.
    },
    addIssue1: function(issue) {
        console.log("Adding issue:", issue);
        $.ajax({
            type: 'POST', url: '/api/addIssue', contentType: 'application/json',
            data: JSON.stringify(issue),
            success: function(data) {
                //// We're advised not to modify the state, it's immutable. So, make a copy.
                var issuesAccomplishedModified = this.state.issuesAccomplished.concat(data);
                this.setState({issuesAccomplished: issuesAccomplishedModified});
            }.bind(this),
            error: function(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    addIssue2: function(issue) {
        console.log("Adding issue:", issue);
        $.ajax({
            type: 'POST', url: '/api/addIssue', contentType: 'application/json',
            data: JSON.stringify(issue),
            success: function(data) {
                //// We're advised not to modify the state, it's immutable. So, make a copy.
                var issuesPlanModified = this.state.issuesPlan.concat(data);
                this.setState({issuesPlan: issuesPlanModified});
            }.bind(this),
            error: function(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    doLogin: function(auth) {
        console.log("doLogin issue:");
        $.ajax({
            type: 'POST', url: '/api/login', contentType: 'application/json',
            data: JSON.stringify(auth),
            success: function(data) {
                var issue = data;
                // We're advised not to modify the state, it's immutable. So, make a copy.
                var issuesAccomplishedModified = this.state.issuesAccomplished.concat(issue.issuesAccomplished);
                var issuesPlanModified = this.state.issuesPlan.concat(issue.issuesPlan);
                this.setState({
                    issuesAccomplished: issuesAccomplishedModified,
                    issuesPlan: issuesPlanModified
                });
            }.bind(this),
            error: function(xhr, status, err) {
                // ideally, show error to user.
                console.log("Error adding issue:", err);
            }
        });
    },
    doRemove1: function(data){
        this.state.issuesAccomplished = _.without(this.state.issuesAccomplished, _.findWhere(this.state.issuesAccomplished, {key: data.key}));
        this.setState(this.state.issuesAccomplished);
    },
    doRemove2: function(data){
        this.state.issuesPlan = _.without(this.state.issuesPlan, _.findWhere(this.state.issuesPlan, {key: data.key}));
        this.setState(this.state.issuesPlan);
    }
});
ReactDOM.render(
<IssueList />,
    document.getElementById('main')
);