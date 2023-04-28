import { defineStore } from "pinia";

export const useLoginUserStore = defineStore('loginUser', {
    state: () => ({
        openid: "",
        uid: "",
        name: "",
        phoneNumber: ""
    }),
    actions: {
        setLoginUser( { openid, uid, name, phoneNumber } ){
            this.openid = openid
            this.uid = uid
            this.name = name
            this.phoneNumber = phoneNumber
        }
    }
})