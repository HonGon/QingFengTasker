<template>
    <uni-section title="联系客服" type="line">
			<uni-list>
                <uni-list-item title="客服电话" rightText="020-8882333888" />
				<uni-list-item title="工作时间" rightText="工作日上午09：00至下午06：00" />
			</uni-list>
            <button type="" @click="onClickBack" >返回</button>
	</uni-section>
</template>

<script setup>
function onClickBack(){
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>

</style>