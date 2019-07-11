import React, { Component } from "react";
import Form from "react-jsonschema-form";
import ReactLoading from 'react-loading';
import { connect } from 'react-refetch'


class FormViewer extends Component {
    constructor(props) {
        super();
        this.state = {
            parameterSchema: props.parameterSchema,
            parameterName: props.parameterName,
            feedName: props.feedName
        }
    }

    render() {
        const onSubmit = ({formData}, e) => this.props.uploadParam(formData, this.state.parameterType, this.state.feedName);
        const { parameterSchema } = this.props;
        const { parameterValue } = this.props;
        if (this.props.parameterType === undefined) {
            return (<div>Select parameter type</div>)
        }
        if (parameterSchema.pending) {
                return <ReactLoading/>
        } else if (parameterSchema.rejected) {
            return <div>Error</div>
        } else if (parameterSchema.fulfilled ) {
            if (parameterValue.fulfilled) {
                const formData= parameterValue.value
            } else if (parameterValue.pending) {
                return <ReactLoading/>
            } else if (parameterValue.rejected) {
                const formData = undefined
            }
            return (
                <div>
                    <Form schema={parameterSchema.value}
                          onSubmit={onSubmit}
                          formData={this.props.parameterValue}
                    />
                </div>
            );
        }
    }
}

export default connect(props => ({
    parameterSchema: {
        url: `feedmanager/getParameterSchema/${props.parameterType}`
    },
    parameterValue: {
        url: `parametercontroller/getParameter/${props.parameterType}/${props.feedName}`
    },
    uploadParam: (formData, parameterName, feedName) => ({
        uploadParamResponse: {
            url: `parametercontroller/setParameter/${parameterName}/${feedName}`,
            body: JSON.stringify(formData),
            method: 'PUT'
        }
    })
}))(FormViewer)
