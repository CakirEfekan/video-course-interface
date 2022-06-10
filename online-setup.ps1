$latestRelease = "https://github.com/CakirEfekan/video-course-interface/releases/latest/download/interface.zip"
$WebClient = New-Object System.Net.WebClient
$WebClient.DownloadFile($latestRelease, ".\interface.zip")
Expand-Archive ".\interface.zip" -DestinationPath ".\"  -Force
Remove-Item ".\interface.zip"


$courseName = Read-Host "Please enter the session name"
$fileType = Read-Host "Please enter the type of videos without dot (.), such as mp4, avi etc."
$folder = Get-Location
$targetfolder = ".\interface"
$list = Get-ChildItem  -Path .\* -Include *.$fileType -name
$fileList = ".\$targetfolder\list.txt"
$dataFile = "data.js"
$file = ".\$targetfolder\$dataFile"
$list | Out-File -FilePath $fileList
Out-File -FilePath $file
Add-Content  "$file" "let fileType = '$fileType'"
Add-Content  "$file" "let courseName = '$courseName'"
$fileNames = (Get-Content -Path "$fileList")
$fileCount = $fileNames.Count
$dataOpener = "let json = {"
$dataCloser = "}"

Add-Content  "$file" "$dataOpener"
$data = [Object[]]::new($fileCount+1)
# [string[]]$arrayFromFile = Get-Content -Path "$file"
for ($i = 0; $i -lt $fileCount; $i++) {
    if( $fileCount -eq 1){
        $name = $fileNames

    }
    else{
        $name = $fileNames[$i]

    }
$checkFiles = $name -match "^([0-9]+)"
if($checkFiles){
}
else{
    Write-Host "The $fileType files name start with ordered number such as 1-themovie.$fileType"
    break;
}
$number = $Matches[0] 
$line = "$number : {name: '$name'},"
$data[$number] = $line

}
if($checkFiles){
    
for ($j = 0; $j -lt $data.Count; $j++) {
    Add-Content  "$file" $data[$j]
    }
    Add-Content  "$file" "$dataCloser"
    
    
    $Shell = New-Object -ComObject ("WScript.Shell")
    $Favorite = $Shell.CreateShortcut($env:USERPROFILE + "\Desktop\$courseName.lnk")
    $Favorite.TargetPath = "$folder$targetfolder\index.html";
    $Favorite.Save()
    invoke-item "$env:USERPROFILE\Desktop\$courseName.lnk"
}