//下面是一个service的简单示例定义，项目不会使用这个service
import  mvueCore from "mvue-toolkit";

var $resource=null;
var customActions = {
  getGlobalUserRole: {method: 'GET', url: 'uasRole/getGlobalUserRole'}
};

export  default function () {
  if($resource!=null){
    return $resource;
  };
  $resource=mvueCore.resource('role{/id}',customActions);
  return $resource;
};
