<template>
  <fin-portlet>
    <fin-portlet-header>
      <fin-portlet-heading :loading="loading" backArrow>Chapters List : {{ presentationId }}</fin-portlet-heading>
      <fin-portlet-item>
        <q-btn label="Add Chapter" dense color="blue-15" class="q-px-md fin-br-8 text-subtitle1 text-weight-bolder"
          no-caps @click="createFile()" />
      </fin-portlet-item>
    </fin-portlet-header>
    <fin-portlet-item class="table-scroll">
      <fin-table :columns="header" :data="chaptersList" select @reCall="getChaptersData()" @editFun="editDataFun"
        :loading="loading" allowDelete :delete-url="deleteUrl" />
    </fin-portlet-item>
  </fin-portlet>
</template>
<script>
import FinTable from "src/components/FinTable.vue"
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import { urls } from "../Urls"
import CryptoJS from 'crypto-js'
export default {
  components: {
    FinTable,
    FinPortlet,
    FinPortletHeader,
    FinPortletHeading,
    FinPortletItem,
  },
  data() {
    return {
      deleteUrl: urls.presentationChapterUrl,
      header: [
        { label: 'S.No', key: 'index', align: 'center' },
        { label: 'Cover', key: 'presentationCoverPath', align: 'start', type: 'image' },
        { label: 'Title', key: 'chapterTitle', align: 'start', width: '150px' },
        { label: 'Description', key: 'description', align: 'start', width: '250px' },
      ],
      chaptersList: [],
      loading: true,
    }
  },
  computed: {
    presentationId() {
      return this.$route.params.id;
    }
  },
  mounted() {
    this.getChaptersData();
  },
  watch: {
    presentationId() {
      this.getChaptersData();
    }
  },
  methods: {
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => { } }
        ]
      });
    },
    getChaptersData() {
      if (this.presentationId) {
        this.loading = true;
        this.$api.get(urls.presentationChapterUrl, {
          params: {
            presentationId: this.presentationId
          }
        }).then(response => {
          this.loading = false;
          if (response.data.success) {
            this.chaptersList = response.data.data.map((item, index) => ({ ...item, index: index + 1 }));
          } else {
            this.showMsg(response.data?.message, 'negative');
          }
        }).catch((error) => {
          this.loading = false;
        })
      }
    },
    editDataFun(val) {
      let item = {
        title: val.chapterTitle,
        description: val.description,
        id: val.id,
        file: val.presentationFilePath,
      };
      this.createFile('Update Chapter', item);
    },
    createFile(title, item) {
      let params = {
        title: title ?? 'Create Chapter',
        url: item?.id ? `${urls.presentationChapterUrl}/${item?.id}` : urls.presentationChapterUrl,
        item: item,
        presentationId: this.presentationId,
        chapter: true,
        requiredCategory: false,
        parentKey: 'presentationId',
        fileKey: "presentationFilePath",
        coverKey: "presentationCoverPath",
        fileAccept: ".doc, .docx,.ppt, .pptx, .pdf",
      };
      params = JSON.stringify(params);
      this.$router.push({
        path: '/admin/create',
        query: {
          params: CryptoJS.AES.encrypt(params, 'fileData').toString()
        }
      });
    }
  }
}
</script>
