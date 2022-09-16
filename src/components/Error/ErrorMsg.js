import React from 'react'

const ErrorMsg = ({Msg}) => {
    return (
        <small className="d-block mt-1 text-danger">* {Msg}</small>
    )
}

export default ErrorMsg
