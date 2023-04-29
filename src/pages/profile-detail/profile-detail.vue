<template>
    <uni-section title="我的信息" type="line">
			<uni-list>
                <uni-list-item title="UID" :rightText="uid" />
				<uni-list-item title="姓名" :rightText="name" />
				<uni-list-item title="手机号码" :rightText="phoneNumber" />
			</uni-list>
            <button type="" @click="onClickBack" >返回</button>
	</uni-section>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { useLoginUserStore } from '../../store/modules/loginUserStore';
import { ref } from 'vue';

const loginUserStore = useLoginUserStore()

const uid = ref('')
const name = ref('')
const phoneNumber = ref('')

function onClickBack(){
    uni.navigateBack()
}


onLoad( () => {
    uid.value = loginUserStore.user.uid
    name.value = loginUserStore.user.name
    phoneNumber.value = loginUserStore.user.phoneNumber
})

</script>

<style lang="scss" scoped>

</style>