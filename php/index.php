<?php 
require_once 'DiServerServices.php';

// Create DiServerService object
$service = new DiServerServicesSample();

// Create Login Object with Service data
$login= new Login();
$login->DataBaseServer="192.168.0.26";
$login->DataBaseName="SBODEMOUS";
$login->DataBaseType="";
$login->DataBaseUserName="sa"; // string
$login->DataBasePassword="\$Aumenta2019#"; // string
$login->CompanyUserName="manager"; // string
$login->CompanyPassword="1234"; // string
$login->Language="23"; // string
$login->LicenseServer="192.168.0.26:30000"; // Change HOST and port

// Call to Login Service with the $login Object
$IdSession=$service->Login($login)->LoginResult;
var_dump($IdSession);
