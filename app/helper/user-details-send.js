'use strict';

module.exports = class Details{
    constructor(){}

    formateData(userInfo){
        return  {
            _id: userInfo._id,
            type: userInfo.type,
            auth: {
                _id: userInfo.auth._id,
                refresh_token: userInfo.auth.refresh_token,
                access_tokenL: userInfo.auth.access_token
            },
            mobile: userInfo.mobile,
            last_name: userInfo.last_name,
            first_name: userInfo.first_name,
            email: userInfo.email,
            gender: userInfo.gender,
            address: userInfo.address
        };
    }
}