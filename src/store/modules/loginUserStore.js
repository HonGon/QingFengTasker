import { defineStore } from "pinia";

export const useLoginUserStore = defineStore('loginUser', {
    state: () => ({
        user: {
            uid: '',
            name: '',
            phoneNumber: ''
        }
    }),
    actions: {
        setLoginUser( user ) {
            this.user.uid = user.uid
            this.user.name = user.name
            this.user.phoneNumber = user.phoneNumber
        }
    }
})