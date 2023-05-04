import { defineStore } from "pinia";

export const useTimerControlStore = defineStore('timerControl',{
    state: () => ({
        newTimer: false,
        orderIdList: []
    }),
    actions:{
        setNewTimer( newTimer ){
            this.newTimer = newTimer
        },

        setOrderIdList(orderIdList) {
            this.orderIdList = orderIdList
        },

        addOrderIdToList( orderId ){
            this.orderIdList.push( orderId )
        },

        deleteOrderIdFromList( orderId ){
            this.orderIdList = this.orderIdList.filter( id => id != orderId )
        },
        //测试用
        popSth(  ){
            this.orderIdList.pop()
        },

        pushSth( sth ){
            this.orderIdList.push( sth )
        }    
    }
})