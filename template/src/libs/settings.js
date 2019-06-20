const settings={
  control:{
    // userSelect:{
    //   filters:''
    // },
    // orgSelect:{
    //   filters:''
    // },
    refEntity:{
      hideDeleted:false
    },
    dateTime:{
      gridFormatter:'simple'//日期时间在grid显示时使用的格式化字符串，支持simple和标准格式化串，如：YYYY-MM-DD HH:mm:ss
    }
  },
  http:{
    // onError:function(error){
    //   var response=error.response;
    //   if(response&&response.status>=400){
    //     return true;
    //   }
    //   return false;
    // },
    showLoading:true
  },
  sidExpired:1000*20/(24*60*60*1000)//20秒
};
export default settings;
