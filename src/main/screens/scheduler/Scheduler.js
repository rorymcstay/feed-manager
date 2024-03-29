import React, {Component} from "react";
import {connect} from 'react-refetch'
import JobStatus from "./JobStatus";
import {Dropdown, Input} from "semantic-ui-react";
import {Grid} from "semantic-ui-react";
import Button from "react-bootstrap/Button";
import ReactLoading from "react-loading";

const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedName: props.feedName,
            url: "",
            trigger: "",
            increment: "",
            increment_size: 0,
            time_out: 0
        }
    }

    onServiceChange = (e, {value}) => {
        this.setState({
            service: value
        })
    };

    onIncrementSizeChange = (e) => {
        this.setState({
            increment_size: e.target.value
        })
    };

    onTriggerChange = (e, {value}) => {
        this.setState({
            trigger: value
        })
    };

    onUrlChange = (value) => {
        this.setState({
            url: value.target.value
        })
    };

    onIncrementChange = (e, {value}) => {
        this.setState({
            increment: value
        })
    };

    onClick = () => {
        const job = {
            feedName: this.state.feedName,
            url: this.state.url,
            trigger: this.state.trigger,
            increment: this.state.increment,
            increment_size: this.state.increment_size,
            time_out: this.state.time_out
        };
        this.props.addJob(job);
        const {data} = this.props;
        if (data.pending) {
            return <ReactLoading/>
        } else if (data.rejected) {
            return <div>Error</div>
        } else if (data.fulfilled) {
            this.setState(
                {
                    feedName: this.props.feedName,
                    url: "",
                    trigger: "",
                    increment: "",
                    increment_size: 0,
                    time_out: 0
                })
        }
    };
    serviceOptions = [
        {
            text: "persistence",
            key: 1,
            value: "persistence"
        },
        {
            text: "summarizer",
            key: 2,
            value: "summarizer"
        }
    ];

    render() {
        const triggerOptions = [
            {
                text: "in",
                key: 1,
                value: "date"
            },
            {
                text: "every",
                key: 2,
                value: "interval"
            }
        ];
        const incrementOptions = [
            {
                text: "minutes",
                key: 1,
                value: "minutes"
            },
            {
                text: "seconds",
                key: 2,
                value: "seconds"
            },
            {
                text: "hours",
                key: 3,
                value: "hours"
            }
        ];
        return (
            <Grid columns={2} relaxed>
                <Grid.Column>
                    <Grid.Row>
                        <Dropdown
                            onChange={this.onTriggerChange}
                            options={triggerOptions}
                            placeholder='trigger'
                            selection
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Input name="searchField"
                               placeholder="number"
                               value={this.state.increment_size}
                               onChange={value => this.onIncrementSizeChange(value)}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Dropdown
                            onChange={this.onIncrementChange}
                            options={incrementOptions}
                            placeholder='when'
                            selection
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Input name="urlField"
                               placeholder="Url to capture"
                               value={this.state.url}
                               onChange={value => this.onUrlChange(value)}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Button
                            variant="primary"
                            onClick={this.onClick}
                        >Schedule Job</Button>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                    <Dropdown
                        onChange={this.onServiceChange}
                        options={this.serviceOptions}
                        placeholder='when'
                        selection
                    />
                    <Button
                        variant="primary"
                        onClick={() => this.props.scheduleService(this.state.service, this.state)}
                    >Schedule Service</Button>
                </Grid.Column>
                <Grid.Column>
                    <JobStatus/>
                </Grid.Column>
            </Grid>
        )
    }
}

export default connect(props => ({
    scheduleService: (serviceName, scheduledJob) => ({
        uploadParamResponse: {
            url: `/schedulemanager/scheduleContainer/${serviceName}`,
            body: JSON.stringify(scheduledJob),
            method: 'PUT'
        }
    }),
    addJob: (scheduledJob) => ({
        uploadParamResponse: {
            url: `/schedulemanager/addJob/${props.feedName}`,
            body: JSON.stringify(scheduledJob),
            method: 'PUT'
        }
    })
}))(Scheduler)
