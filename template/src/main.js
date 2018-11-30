import indexBase from 'libs/index_base';
import mvueToolkit from 'mvue-toolkit';

//应用依赖的模块，通过moduleManager添加进来
import mvueModuleSystem from 'mvue-module-system';
mvueToolkit.moduleManager.add(mvueModuleSystem);

//启动应用
indexBase.startApp();
