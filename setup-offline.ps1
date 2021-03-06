# PI.ps1
    $courseName = Read-Host "Please enter the course name"
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
 $fileNames = (Get-Content -Path "$fileList")
 $fileCount = $fileNames.Count
 $dataOpener = "let json = {"
$dataCloser = "}"

Add-Content  "$file" "$dataOpener"
$data = [Object[]]::new($fileCount+1)
# [string[]]$arrayFromFile = Get-Content -Path "$file"
for ($i = 0; $i -lt $fileCount; $i++) {
    $name = $fileNames[$i]
    $name -match "^([0-9]+)"
    $number = $Matches[0] 
    $line = "$number : {name: '$name'},"
    $data[$number] = $line
   
}
for ($j = 0; $j -lt $data.Count; $j++) {
    Add-Content  "$file" $data[$j]
}
Add-Content  "$file" "$dataCloser"


$Shell = New-Object -ComObject ("WScript.Shell")
$Favorite = $Shell.CreateShortcut($env:USERPROFILE + "\Desktop\$courseName.lnk")
$Favorite.TargetPath = "$folder$targetfolder\index.html";
$Favorite.Save()

