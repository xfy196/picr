<template>
  <a-card class="container">
    <a-steps :current="current">
      <a-step title="创建GitHub仓库"> </a-step>
      <a-step title="获取GitHub Token" />
      <a-step title="配置图床" />
    </a-steps>
    <div class="step-content">
      <a-typography v-if="current === 2">
        <a-typography-title :level="2">
          进行图床配置（绑定 GitHub Token、存储图片的仓库和目录）
        </a-typography-title>
        <a-typography-paragraph class="typo-wrapper">
          <div class="op-tip-img">
            <img
              src="https://cdn.jsdelivr.net/gh/xfy196/images@main/image.4dd81e08a139d53d.png"
              alt=""
            />
          </div>
          <div class="step3-tip">
            <a-typography-text>
              新建目录：需手动输入一个新目录。
            </a-typography-text>
            <a-typography-text>
              根目录：图片将直接存储在仓库根目录下。
            </a-typography-text>
            <a-typography-text>
              自动目录：自动生成日期格式 YYYYMMDD 的目录。例如：20200909
            </a-typography-text>
            <a-typography-text>
              选择仓库目录：自动获取仓库下所有目录，选择一个即可。
            </a-typography-text>
          </div>
        </a-typography-paragraph>
      </a-typography>
      <a-typography v-if="current === 1">
        <a-typography-title :level="2">
          创建一个有repo权限的
          <a-button
            style="font-size: 30px"
            href="https://github.com/settings/tokens/new"
            type="link"
          >
            GitHub Token
          </a-button>
        </a-typography-title>
        <a-typography-paragraph class="typo-wrapper">
          <div class="op-tip-img">
            <img
              src="https:/cdn.jsdelivr.net/gh/xfy196/images@main/WX20220405-161249.1e47e073300daa05.png"
              alt=""
            />
          </div>
        </a-typography-paragraph>
        <a-typography-title :level="2">
          然后点击 Generate token 按钮，即可生成一个token，如下图：
        </a-typography-title>
        <a-typography-paragraph class="typo-wrapper">
          <div class="op-tip-img">
            <img
              src="https:/cdn.jsdelivr.net/gh/xfy196/images@main/WX20220405-161431.14dfcff5ad055468.png"
              alt=""
            />
          </div>
          <a-typography-text type="danger"
            >新生成的 Token
            只会显示一次，请妥善保存！如有遗失，重新生成即可。</a-typography-text
          >
        </a-typography-paragraph>
      </a-typography>
      <a-typography v-if="current === 0">
        <a-typography-title :level="2">
          创建一个用来存储的图片的
          <a-button
            style="font-size: 30px"
            href="https://github.com/new"
            type="link"
          >
            GitHub 仓库
          </a-button>
        </a-typography-title>
        <a-typography-paragraph class="typo-wrapper">
          <div class="op-tip-img">
            <img
              src="https:/cdn.jsdelivr.net/gh/xfy196/images@main/WX20220405-155823.e4775ddcfbcf7d86.png"
              alt=""
            />
          </div>
        </a-typography-paragraph>
      </a-typography>
      <a-space class="btns-box">
        <a-button
          v-if="current !== 0"
          @click.stop="handlePrevBtn"
          type="primary"
          >上一步</a-button
        >
        <a-button
          v-if="current !== 2"
          @click.stop="handleNextBtn"
          type="primary"
          >下一步</a-button
        >
      </a-space>
    </div>
  </a-card>
</template>
<script setup>
import { ref } from "vue-demi";

const current = ref(0);
const handleNextBtn = () => {
  current.value++;
};
const handlePrevBtn = () => {
  current.value--;
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  overflow: auto;
  .step-content {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .ant-typography {
      text-align: center;
      .step3-tip{
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
      }
    }
    .typo-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      .op-tip-img {
        margin: 12px 0;
        img {
          width: 100%;
        }
      }
    }
    .btns-box {
      display: flex;
      justify-content: center;
    }
  }
}
</style>