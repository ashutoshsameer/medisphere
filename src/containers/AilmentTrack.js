import React from "react";

export default function AilmentTrack(props) {
    return (
        <div>
            {props.match.params.name}
        </div>
    );
}