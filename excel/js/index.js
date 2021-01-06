var $excel = {
	workbook:'',//读取到的数据
	merges:'',//!merges,合并单元格数据
	json:'',//json数据格式
	csv:'',//csv格式
	mergeCells:'',//合并单元格，处理过的数据格式
	mergeCellsHidden:'',//合并单元格，被合并掉的部分
};
$(document).on('change','#file', function(e) {
	var files = e.target.files;
	if(files.length == 0) return;
	var f = files[0];
	// if(!/\.xlsx$/g.test(f.name)) {
	// 	alert('仅支持读取xlsx格式！');
	// 	return;
	// }
	if(!/\.xlsx$/g.test(f.name) && !/\.xls$/g.test(f.name)) {
		alert('仅支持读取xlsx格式！');
		return;
	}
	readWorkbookFromLocalFile(f, function(workbook) {
		readWorkbook(workbook);
	});
});
// 读取本地excel文件
function readWorkbookFromLocalFile(file, callback) {
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		if(callback) callback(workbook);
	};
	reader.readAsBinaryString(file);
};
// excel数据进行处理
function readWorkbook(workbook) {
	var sheetNames = workbook.SheetNames; // 工作表名称集合
	var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
	var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]],{raw: true, header: 1 });
	console.log('workbook',workbook);
	console.log('worksheet',worksheet);
	console.log('json',json);
	$excel.workbook=workbook;
	$excel.merges=worksheet['!merges'];
	$excel.json=json;
	mergeCellsHandle(worksheet['!merges']);// 单元格数据处理
	// $('#result').html(jsontable());
	var csv = XLSX.utils.sheet_to_csv(worksheet);
	$excel.csv=csv;
	$('#result').html(csv2table());
	// console.log('csv',csv);
	// $('#result').html(csv2table(csv));//展示到页面
	// const header = ["id", "S","h","e","e_1","t","J"];
	// const newData = window.XLS.utils.sheet_to_json(worksheet);
 //    console.log('newData',newData)
};
/**
 *合并单元格数据处理
 *Sheet Object
每一个Sheet Object表示一张表格，只要不是!开头的都表示普通cell，否则，表示一些特殊含义，具体如下：
sheet['!ref']：表示所有单元格的范围，例如从A1到F8则记录为A1:F8；
sheet[!merges]：存放一些单元格合并信息，是一个数组，每个数组由包含s和e构成的对象组成，s表示开始，e表示结束，r表示行，c表示列；
等等；
关于单元格合并，看懂下面这张图基本上就没问题了：
 */
// 单元格数据处理
function mergeCellsHandle($merges){
	var mergeCells=[];
	var mergeCellsHidden=[];
	// 合并单元格信息处理
	for(var i = 0; i < $merges.length; i ++){
		var $row = $merges[i]['s'].r+1;
		var $col = $merges[i]['s'].c+1;
		var $rowspan = ($merges[i]['e'].r - $merges[i]['s'].r)+1; 
		var $colspan = ($merges[i]['e'].c - $merges[i]['s'].c)+1;
		var $cell = {
			row: $row,
			col: $col,
			rowspan: $rowspan, 
			colspan: $colspan
		};
		// mergeCells.push($cell);
		mergeCells[$row +'@@' + $col] ||(mergeCells[$row + '@@' + $col] = $cell);//合并，行@@列
		// 需要被合并掉的单元格坐标
		var $rowH = $merges[i]['s'].r+1;//被合并掉row起始坐标
		var $colH = $merges[i]['s'].c+1;//被合并掉col起始坐标
		var $rowspanH = ($merges[i]['e'].r - $merges[i]['s'].r); //被合并掉row个数
		var $colspanH = ($merges[i]['e'].c-$merges[i]['s'].c);//被合并掉col个数
		var $cellH = $cell;
		if($rowspanH > 0){
			if($colspanH > 0){
				for(var r_i = 0; r_i < $rowspanH; r_i ++){
					mergeCellsHidden[($rowH+1+r_i) +'@@' + $colH]||(mergeCellsHidden[($rowH+1+r_i) +'@@' + $colH] = $cellH);//合并，行@@列【row被合并掉】
					for(var c_i = 0; c_i < $colspanH; c_i ++){
						mergeCellsHidden[$rowH +'@@' + ($colH+1+c_i)]||(mergeCellsHidden[$rowH +'@@' + ($colH+1+c_i)] = $cellH);//合并，行@@列【cow被合并掉】
						mergeCellsHidden[($rowH+1+r_i) +'@@' + ($colH+1+c_i)]||(mergeCellsHidden[($rowH+1+r_i) +'@@' + ($colH+1+c_i)] = $cellH);//合并，行@@列【row与row被合并掉】
					}
				}
			}else{
				for(var r_i = 0; r_i < $rowspanH; r_i ++){
					mergeCellsHidden[($rowH+1+r_i) +'@@' + $colH]||(mergeCellsHidden[($rowH+1+r_i) +'@@' + $colH] = $cellH);//合并，行@@列【row被合并掉】
				}
			}
		}else if($colspanH > 0){
			for(var c_i = 0; c_i < $colspanH; c_i ++){
				mergeCellsHidden[$rowH +'@@' + ($colH+1+c_i)]||(mergeCellsHidden[$rowH +'@@' + ($colH+1+c_i)] = $cellH);//合并，行@@列【cow被合并掉】
			}
		}
	}
	$excel.mergeCells = mergeCells;
	$excel.mergeCellsHidden = mergeCellsHidden;
	console.log('merges',$excel.merges);
	console.log('mergeCells',mergeCells);
	console.log('mergeCellsHidden',mergeCellsHidden);
};
//处理的数据渲染表格
function jsontable(){
	var html = '<table>';
	$excel.json.forEach(function(row, idx) {
		var columns = row;
		columns.unshift(idx+1); // 添加行索引
		if(idx == 0) {
			html += '<tr>';
			for(var c_i=0; c_i<columns.length; c_i++) {
				html += '<th>' + columns[c_i] + '</th>';
			}
			html += '</tr>';
		}
		html += '<tr>';
		for(var td_i=0; td_i<columns.length; td_i++){
			html += '<td rowspan="" colspan="">'+columns[td_i]+'</td>';
		}
		html += '</tr>';
	});
	html += '</table>';
	return html;
};
// 将csv转换成表格
function csv2table(csv){
	var csv = $excel.csv;
	var html = '<table>';
	var rows = csv.split('\n');
	rows.pop(); // 最后一行没用的
	rows.forEach(function(row, idx) {
		var columns = row.split(',');
		columns.unshift(idx+1); // 添加行索引
		if(idx == 0) { // 添加列索引
			html += '<tr>';
			for(var i=0; i<columns.length; i++) {
				html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
			}
			html += '</tr>';
		}
		html += '<tr>';
		columns.forEach(function(column,idex) {
			var $cell = (idx + 1) + '@@' + idex;
			if($excel.mergeCells[$cell]){
				var $rowspan = $excel.mergeCells[$cell].rowspan;
				var $colspan = $excel.mergeCells[$cell].colspan;
				html += '<td rowspan="' + $rowspan + '" colspan="' + $colspan + '">'+column+'</td>';
			}else{
				var isHidden=''
				if($excel.mergeCellsHidden[$cell]){
					// 被合并掉的，不显示
					isHidden = 'hidden';
				}else{
					isHidden = '';
				}
				html += '<td class="' + isHidden + '">'+column+'</td>';
			}
		});
		html += '</tr>';
	});
	html += '</table>';
	return html;
};