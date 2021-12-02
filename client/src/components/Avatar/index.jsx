import React from 'react'
import CONSTANTS from '../../constants';

export default function Avatar(props) {
    return (
        <img
              src={props.avatar === 'anon.png' ? CONSTANTS.ANONYM_IMAGE_PATH : `${CONSTANTS.publicURL}/avatars/${props.avatar}`}
              className={props.className}
              alt="user avatar"
              onError={(e) => {
                e.target.src = CONSTANTS.ANONYM_IMAGE_PATH;
              }}
            />
    )
}
