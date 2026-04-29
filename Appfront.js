fetch("data.json")
    .then(response => response.json())
    .then(data => {console.log(data);
const quest=document.createElement("p");
const answer=document.createElement("p");
const r1=document.createElement("input");
const r2=document.createElement("input");
const r3=document.createElement("input");
    
r1.setAttribute("type","radio");
r1.setAttribute("name","opt");
    
r2.setAttribute("type","radio");
r2.setAttribute("name","opt");
    
r3.setAttribute("type","radio");
r3.setAttribute("name","opt"); 
const lab1=document.createElement("label");
const lab2=document.createElement("label");
const lab3=document.createElement("label");
const btn=document.createElement("button");
btn.innerHTML="Start the Game";
document.getElementById("questionpanel").appendChild(btn);
let i=0;
var correctanswer="0";
btn.addEventListener("click",nextquestion);
function nextquestion()
{       
if(r1.checked||r2.checked||r3.checked||i==0)
  {
    if(i==0){document.getElementById("showresultpanel").innerHTML="";}
        
    if(i<5){
    quest.innerHTML=(i+1)+".  "+data[i].question;
    answer.innerHTML="Answer:  "+data[i].answer+"<br>";
    lab1.innerHTML="  "+data[i].options[0]+"<br>";
    lab2.innerHTML="  "+data[i].options[1]+"<br>";
    lab3.innerHTML="  "+data[i].options[2]+"<br>"; i++;
    r1.checked=false;
    r2.checked=false;
    r3.checked=false;
    r1.disabled = false;
    r2.disabled = false;
    r3.disabled = false;
    btn.innerHTML="Next"; if(i==5){btn.innerHTML="Finish";}
    
}
else{   
    btn.innerHTML="Start Again";
    if(i==5){document.getElementById("showresultpanel").innerHTML="Result : "+correctanswer+"/5";}
             
     i=0; correctanswer="0";
    } 
document.getElementById("questionpanel").appendChild(quest);
document.getElementById("questionpanel").appendChild(r1);document.getElementById("questionpanel").appendChild(lab1);
document.getElementById("questionpanel").appendChild(r2);document.getElementById("questionpanel").appendChild(lab2)
document.getElementById("questionpanel").appendChild(r3);document.getElementById("questionpanel").appendChild(lab3);
document.getElementById("answerCorrect").innerHTML="";
  }
  else{document.getElementById("checkradio_click").innerHTML="Please select one option!!!";}
}
function disableRadioButtons() {
  if (r1.checked || r2.checked || r3.checked) {
    r1.disabled = true;
    r2.disabled = true;
    r3.disabled = true;
  }
}
r1.addEventListener("click",checkanswer);
    function checkanswer()
    { document.getElementById("checkradio_click").innerHTML="";
  
      if(r1.checked && data[i-1].options[0]==data[i-1].answer)
        {document.getElementById("answerCorrect").innerHTML="Correct answer"; correctanswer++;}
     else {document.getElementById("answerCorrect").innerHTML="Wrong answer";}
     disableRadioButtons();
    }
r2.addEventListener("click",checkanswer2);
    function checkanswer2()
    {   document.getElementById("checkradio_click").innerHTML="";
        if(r2.checked && data[i-1].options[1]==data[i-1].answer)
       {document.getElementById("answerCorrect").innerHTML="Correct answer"; correctanswer++;}
     else {document.getElementById("answerCorrect").innerHTML="Wrong answer";}
     disableRadioButtons();
    }
r3.addEventListener("click",checkanswer3);
     function checkanswer3()
     {  document.getElementById("checkradio_click").innerHTML="";
      
      if(r3.checked && data[i-1].options[2]==data[i-1].answer)
      {document.getElementById("answerCorrect").innerHTML="Correct answer"; correctanswer++;}
      
     else {document.getElementById("answerCorrect").innerHTML="Wrong answer";}
     disableRadioButtons();
     } 
     
});
