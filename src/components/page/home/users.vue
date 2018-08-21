<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>用户信息</el-breadcrumb-item>
            </el-breadcrumb>

            <!--<div style="width: 200px;height: 200px; background-color: #fff;color: red">-->
                <!--<p>{{count}}</p>-->
                <!--<p>&#45;&#45;&#45;&#45;&#45;&#45;</p>-->
                <!--<p>-->
                    <!--<button @click="increment">+</button>-->
                    <!--<button @click="decrement">-</button>-->
                <!--</p>-->

            <!--</div>-->


        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                    <el-option key="3" label="全部" value=""></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" style="width: 100%" tooltip-effect="dark" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="id" label="id" width="50"></el-table-column>
                <el-table-column prop="name" label="用户名" width="120"></el-table-column>
                <el-table-column prop="password" label="密码" width="300"></el-table-column>
                <el-table-column prop="address" label="地址" ></el-table-column>
                <el-table-column prop="date" label="日期" ></el-table-column>
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
                <el-form-item label="id">
                    <el-input disabled v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="账户">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="form.date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        align="right">
                    </el-date-picker>
                    <!--<el-input v-model="form.date"></el-input>-->
                </el-form-item>
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
    </div>
</template>



<script>
    import axios from 'axios';
    import { root } from '../../../util/api';
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                loading:true,
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
            // 注册用户
            // for(let i = 0;i<30;i++){
            //     this.register(i);
            // }
            console.log(root);

        },
        computed: {
            // count(){
            //     return this.$store.state.count;
            // },
            data() {
                this.newData = [];
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if(d.address && d.name){
                            if (d.address.indexOf(this.select_cate) > -1 &&
                                (d.name.indexOf(this.select_word) > -1 ||
                                    d.address.indexOf(this.select_word) > -1)
                            ) {
                                this.newData.push(d);
                                return d;
                            }

                        }

                    }
                })
            }
        },
        methods: {
            increment(){
                this.$store.commit('increment')
            },
            decrement(){
                this.$store.commit('decrement')
            },
            // 注册
            register(i){

                    this.url = process.env.API_ROOT+'/users/register';

                let date = {
                    name: 'duguangyana' + JSON.stringify(i),
                    password: 'duguangyan',
                    address: '广东省广州市'
                }
                axios.post(this.url,date).then((res) => {
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

                    this.url = process.env.API_ROOT+'/users/getUsers?page=' + this.cur_page;

                axios.get(this.url).then((res) => {
                    if(res.data.code==200){
                        this.total = res.data.total;
                        this.tableData = res.data.data;
                        this.$set(this,'loading',false);
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
                this.idx = index;
                const item = this.newData[index];
                this.form = {
                    id:item.id,
                    name: item.name,
                    date: item.date,
                    password: item.password,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id  = row.id;
                this.delVisible = true;
            },
            delAll() {

                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                    this.url = process.env.API_ROOT+'/users/userDel';

                axios.post(this.url,{
                    id:this.idString,
                }).then((res) => {
                    if(res.data.code==200){


                        const length = this.multipleSelection.length;
                        let str = '';
                        this.del_list = this.del_list.concat(this.multipleSelection);
                        for (let i = 0; i < length; i++) {
                            str += this.multipleSelection[i].name + ' ';
                        }
                        this.$message.error('删除了' + str);
                        this.multipleSelection = [];


                    }else{
                        this.$message.error(res.data.msg);
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

                    this.url = process.env.API_ROOT+'/users/userEdit';

                axios.post(this.url,{
                    id:this.form.id,
                    name: this.form.name,
                    date: this.form.date,
                    password: this.form.password,
                    address: this.form.address
                }).then((res) => {
                    if(res.data.code==200){
                        this.form.password = res.data.data.password;
                        this.$set(this.tableData, this.idx, this.form);
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx+1} 行成功`);
                    }else{
                        this.$message.error(res.data.msg);
                    }

                }).catch((res)=>{
                    this.$message.error(res.msg);
                })


            },
            // 确定删除
            deleteRow(){
                console.log(this.idx);
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件

                    this.url = process.env.API_ROOT+'/users/userDel';

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
