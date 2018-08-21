<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>新闻信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="search" @click="addNews">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" tooltip-effect="dark" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="id" label="id" width="50"></el-table-column>
                <el-table-column prop="title" label="标题" width="50"></el-table-column>
                <el-table-column prop="content" label="内容" width="200"></el-table-column>
                <el-table-column prop="imgUrl" label="图片"></el-table-column>
                <el-table-column label="图片" width="100px">
                    <template slot-scope="scope">
                        <div>
                            <img style="width: 80px;height: 80px;" :src="scope.row.imgUrl" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="日期"  width="150"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="5" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="图片">
                    <img :src="form.imgUrl" v-show="isImgShow" style="width: 146px;height: 146px;" alt="">
                    <el-upload
                        action="./public/uploader"
                        list-type="picture-card"
                        name="imgName"
                        ref="upload"
                        :multiple="false"
                        :limit="1"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :on-change="uploadChane">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="id">
                    <el-input disabled v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>

                <!--<el-form-item label="日期">-->
                    <!--<el-date-picker-->
                        <!--v-model="form.date"-->
                        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                        <!--type="datetime"-->
                        <!--format="yyyy-MM-dd HH:mm:ss"-->
                        <!--placeholder="选择日期时间"-->
                        <!--align="right">-->
                    <!--</el-date-picker>-->
                    <!--&lt;!&ndash;<el-input v-model="form.date"></el-input>&ndash;&gt;-->
                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>



        <!-- 新增信息框 -->
        <el-dialog title="新增信息列表" :visible.sync="addVisible" width="600px" center>
            <div class="del-dialog-cnt">
                <div>
                    <el-upload
                        action="http://localhost:8000/public/uploader"
                        list-type="picture-card"
                        name="imgName"
                        :multiple="false"
                        :limit="1"
                        ref="upload"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :on-change="uploadChane">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <div style="height: 30px;"></div>
                    <el-input style="width: 50%"
                              autosize
                              placeholder="请输入内容"
                              v-model="title">
                    </el-input>
                    <div style="margin: 20px 0;"></div>
                    <el-input style="width: 50%"
                              type="textarea"
                              :autosize="{ minRows: 2, maxRows: 6}"
                              placeholder="请输入内容"
                              v-model="content">
                    </el-input>

                    <!--<el-button type="primary" @click="submit">提交</el-button>-->
                </div>


            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>



<script>
    import axios from 'axios';
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                newsLoading:true,
                total:0,
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                addVisible:false,
                dialogImageUrl: '',
                dialogVisible: false,
                isImgShow:true,
                title:'',
                content:'',
                imgId:'',
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();

        },
        computed: {
            data() {

            }
        },
        methods: {
            // 新增列表确认按钮
            addRow(){

            },
            // 新增按钮点击
            addNews(){
                this.addVisible = true;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.imgId = '';
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            uploadSuccess(res, file, fileList){
                if(res.code==200){
                    this.$message('图片上传成功');
                    this.imgId  = res.data.id;
                    this.imgUrl = res.data.url;
                }
                this.isImgShow = false;
            },
            uploadError(err, file, fileList){
                console.log(err);
                this.$message.error('图片上传失败');
            },
            uploadChane(file, fileList){

            },
            addSubmit(){
                if(this.title=='' || this.content==''){
                    this.$message.error('请填写完整信息');
                    return false
                }
                let data  = {
                    title:this.title,
                    content:this.content,
                    imgId:this.imgId
                }
                console.log(data);
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                    this.url = process.env.API_ROOT+'/users/addNews';

                axios.post(this.url,data).then((res) => {
                    if(res.data.code==200){
                        data.imgUrl = this.imgUrl;
                        data.id = res.data.data.insertId;
                        this.tableData.push(data);
                        this.$message(res.data.msg);
                        setTimeout(()=>{
                            this.addVisible = false;
                        },500)
                    }else{
                        this.$message.error(res.data.msg);
                    }

                }).catch((res)=>{
                    this.$message.error(res.data.msg);
                })

            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                    this.url = process.env.API_ROOT+'/users/newsList?page=' + this.cur_page;

                axios.get(this.url).then((res) => {
                    if(res.data.code==200){
                        this.total = res.data.total;
                        this.tableData = res.data.data;
                        this.$set(this,'newsLoading',false);
                        loading.close();
                    }else{
                        this.$message.error(res.data.msg);
                        loading.close();
                    }
                }).catch((res)=>{
                    loading.close();
                    this.$message.error(res.data.msg);
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.form.imgId = null;
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id:item.id,
                    title:item.title,
                    content: item.content,
                    imgUrl: item.imgUrl,
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id  = row.id;
                this.delVisible = true;
            },
            delAll() {
                console.log(this.idString);
                if(this.idString==undefined){
                    this.$message.error('请选中删除对象');
                    return false;
                }
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                    this.url = process.env.API_ROOT+'/users/newsDel';

                axios.post(this.url,{
                    id:this.idString,
                }).then((res) => {
                    if(res.data.code==200){
                        const length = this.multipleSelection.length;
                        let str = '';
                        this.del_list = this.del_list.concat(this.multipleSelection);
                        for (let i = 0; i < length; i++) {
                            str += this.multipleSelection[i].title + ' ';
                        }
                        this.$message.error('删除了' + str);
                        this.multipleSelection = [];
                        let arrIds = this.idString.split(',');


                        for(let j=0;j<arrIds.length;j++){
                            for(let i=0;i<this.tableData.length;i++){
                                if(this.tableData[i].id == arrIds[j]){
                                    this.tableData.splice(i,1);
                                }
                            }

                        }


                    }else{
                        this.$message(res.data.msg);
                    }

                }).catch((res)=>{
                    this.$message.error(res.msg);
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.idString = '';
                val.forEach((v,i)=>{
                    val.length==1 || val.length==(i+1) ?this.idString += v.id:this.idString += v.id +',';
                    console.log(this.idString);
                })
            },
            // 保存编辑
            saveEdit() {
                console.log(this.form);

                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                    this.url = process.env.API_ROOT+'/users/editNews';

                axios.post(this.url,{
                    id:this.form.id,
                    title: this.form.title,
                    content: this.form.content,
                    imgId: this.form.imgId || this.imgId,
                }).then((res) => {
                    if(res.data.code==200){
                        this.form.imgUrl = this.imgUrl;
                        this.$set(this.tableData, this.idx, this.form);
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx+1} 行成功`);
                    }else{
                        this.$message.error(res.data.msg);
                    }

                }).catch((res)=>{
                    this.$message.error(res.msg);
                })
                this.isImgShow = true;
                this.$refs.upload.clearFiles();
            },
            // 确定删除
            deleteRow(){
                console.log(this.idx);
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                this.url = process.env.API_ROOT+'/users/newsDel';

                axios.post(this.url,{
                    id:this.id,
                }).then((res) => {
                    if(res.data.code==200){
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((res)=>{
                    this.$message.error(res.msg);
                })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
