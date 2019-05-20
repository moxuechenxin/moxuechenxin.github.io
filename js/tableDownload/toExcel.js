(function(){
  // 应用base64编码
  // data协议：https://www.cnblogs.com/liyongquan/p/8615928.html （data:资源类型，编码，内容）
  // html content-type 对照表 http://tool.oschina.net/commons/ （excel格式：application/vnd.ms-excel）
  // 定义excel模板
  // var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
  // xmlns:x="urn:schemas-microsoft-com:office:excel" 
  // xmlns="http://www.w3.org/TR/REC-html40">
  // <head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
  //   <x:Name>${worksheet}</x:Name>
  //   <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
  //   </x:ExcelWorksheets></x:ExcelWorkbook></xml>
  //   </head><body>{htmldata}</body></html>`
  var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>sheet</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>{htmldata}</body></html>'
  var worksheet = 'Sheet_ie'
  var Excel_URL = 'data:application/vnd.ms-excel;base64,'
  var Export = {
    toExcel:function(data){
      console.log(window.navigator.userAgent) // 浏览器内核 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36
      var isIE = window.navigator.userAgent.toLocaleLowerCase().indexOf('trident'); // 浏览器内核 'MSIE'/'Trident' 均可判断是否IE内核
      console.log(isIE);
      if (isIE !== -1 ) {
        // ie浏览器
        this._IEExport(data);
      } else {
        // 其他浏览器
        this._OtherExport(data);
      }
    },
    _IEExport: function(data){
      // ie报错：oWB对象不支持SavaAs()方法
      // 1.打开excel软件
      var oXL = new ActiveXObject("Excel.Application")
      // 2.新建工作簿
      // var oWB = oXL.Workbooks.Add
      var oWB = oXL.Workbooks.Add()
      // 3.激活新建的工作簿
      var oSheet = oWB.ActiveSheet
      // var oSheet = oWB.Worksheets(1)
      if (typeof data === "string") {
        // 表格id
        var table = document.querySelector(data);
        // 创建装内容的容器
        var sel = document.body.createTextRange()
        // 将table中的内容移入容器中
        sel.moveToElementText(table)
        // 选中移入的内容
        try {
          sel.select()
        } catch(err){
          console.log(err)
        }
        // 复制容器的内容
        sel.execCommand("Copy")
        // 粘贴到excel工作簿中
        oSheet.Paste()
      } else {
        var j = 0;
        for (key in data[0]) {
          oSheet.Cells(1,++j).value = data[0][key]
        }
        for (var i = 0,len = data.length; i < len; i++) {
          j = 0
          var row = data[i]
          for (key in data[i]) {
            oSheet.Cells(i+1,++j) = row[key]
          }
        }
      }
      // 设置文件名和保存类型
      var filename = oXL.Application.GetSaveAsFilename(worksheet + ".xls", "Excel Spreadsheets (*.xls), *.xls")
      // 保存工作簿
      oWB.SavaAs(filename)
      // 关闭退出
      oWB.Close()
      oXL.Quit()
    },
    _OtherExport:function(data){
      var content = '';
      // 判断数据类型：表格id，json数据
      if (typeof data === "string") {
        // 表格id
        var ele = document.querySelector(data);
        console.log(data, ele)
        content = template.replace("{htmldata}", ele.outerHTML);
      } else {
        console.log(data, '111')
        var arr = [];
        arr.push("<table>") // 可以通过style添加样式
        data.forEach(function(value){
          arr.push("<tr>")
          for (key in value) {
            var str = "<td>" + value[key] + "</td>"
            arr.push(str)
          }
          arr.push("</tr>")
        });
        arr.push("</table>")
        content = template.replace("{htmldata}", arr.join(''))
      }
      // 链接跳转下载
      var aEle = document.createElement('a');
      // window.btoa() => 将内容转变成base64字符，window.atob() => 解码base64字符。
      // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码(避免中文乱码); unescape() 函数可对通过 escape() 编码的字符串进行解码。
      aEle.href = Excel_URL + window.btoa(unescape(encodeURIComponent(content)));
      aEle.download = worksheet;
      aEle.click();
    }
  };
  window.Export = Export;
})();