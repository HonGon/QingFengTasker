<template>
    <view class="content">
        <!--订单切换-->
        <view class="page-segement">
            <uni-segmented-control class="page-segement-control" :current="segIndex" :values="segItems" @clickItem="onSegmentChange" styleType="text" activeColor="#007aff"></uni-segmented-control>
        </view>
        
        <!-- 搜索条以及筛选条件 -->
        <view class="search">
            <view class="search-bar">
                <uni-search-bar cancelButton="auto" placeholder="搜索" radius=10></uni-search-bar>
            </view>
            <view class="search-selected">
                <uni-data-select 
                class="search-selected"
                v-model="orderState"
                :localdata="orderStateRange"
                @change="change">
                </uni-data-select>
            </view>
        </view>
    </view>
</template>

<script>
import uniSegmentedControl from "@dcloudio/uni-ui/lib/uni-segmented-control/uni-segmented-control.vue"
import uniSearchBar from "@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue"
import uniDataSelect from "@dcloudio/uni-ui/lib/uni-data-select/uni-data-select.vue"


export default {
    components:{
        uniSegmentedControl,
        uniSearchBar,
        uniDataSelect
    },
    data() {
        return {
            segIndex:0,
            segItems:["我发布的","我接下的"],
            orderState:0,
            orderStateRange: [{ orderState: 0, text: "全部" },
            { orderState: 1, text: "未接下" },
            { orderState: 2, text: "执行中" },
            { orderState: 3, text: "未付款" },
            { orderState: 4, text: "已完成" }
            ]
        }
    },
    methods:{
        onSegmentChange(e) {
            console.log(e);
            if (this.segIndex != e.currentIndex) {
                this.segIndex = e.currentIndex;
            }
            if (this.segIndex == 0) {
                this.orderStateRange = [
                { orderState: 0, text: "全部" },
                { orderState: 1, text: "未接下" },
                { orderState: 2, text: "执行中" },
                { orderState: 3, text: "未付款" },
                { orderState: 4, text: "已完成" }
                ]
            } else {
                this.orderStateRange = [
                { orderState: 0, text: "全部" },
                { orderState: 2, text: "执行中" },
                { orderState: 3, text: "未付款" },
                { orderState: 4, text: "已完成" }
                ]
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>
@import "./my-orders.scss"

</style>