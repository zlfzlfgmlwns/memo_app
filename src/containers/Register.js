import React, { Component } from 'react';
import { Authentication } from 'components';
import {registerRequest} from 'actions/authentication';
import { connect } from 'react-redux';
class Register extends Component {
    handleRegister = (id, pw)=>{
        return this.props.registerRequest(id,pw).then(
            ()=>{
                if(this.props.status === "SUCCESS"){
                    Materialize.toast('Success! Please log in.', 2000);
                    this.props.history.push('/login');
                    return true;
                }else {
                     /*
                        ERROR CODES:
                            1: BAD USERNAME
                            2: BAD PASSWORD
                            3: USERNAME EXISTS
                    */
                   let errorMessage = [
                    'Invalid Username',
                    'Password is too short',
                    'Username already exists'
                ];

                let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                Materialize.toast($toastContent, 2000);
                return false;
                }
            }
        )
    }
    render() {
        return (
            <div>
                <Authentication mode={false}
                    onRegister={this.handleRegister}
                />
            </div>
        );
    }
}


const mapStateToProps = (state) =>{
    return {
        status:state.authentication.register.status,
        errorCode:state.authentication.register.error
    };
}


const mapDispatchToProps = (dispatch) =>{
    return {
        registerRequest: (id, pw)=>{
            return dispatch(registerRequest(id,pw));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);