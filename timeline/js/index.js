var $timeline = '';//存储预览的数据
$('#importInput').change(function(){
    var file = this.files[0];      
    var fileReader = new FileReader();
    fileReader.readAsText(file)
    fileReader.onload = () => {
        console.log(fileReader.result)
        $timeline = JSON.parse(fileReader.result);
    }
});
// 点击预览json
$('#previewBtn').on('click',function(){
    createStoryJS({
        type:   'timeline',
        width:    '100%',
        height:   '600',
        source:   $timeline,
        embed_id: 'timeline',
        debug:    true
    });
});