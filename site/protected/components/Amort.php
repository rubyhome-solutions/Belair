<?php

//
// class.amort.php
// version 1.0.1, 18 July, 2005
// version 1.0.1, 14 Feb, 2006
//     Fixed divide by zero problem when input values are zero.
//
// License
//
// PHP class to calculate and display an amorization schedule table given
// the amount of loan, the interest rate, and the length of the loan.
//
// Copyright (C) 2005 George A. Clarke, webmaster@gaclarke.com, http://gaclarke.com/
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation; either version 2 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 59 Temple
// Place - Suite 330, Boston, MA 02111-1307, USA.
//
// Description
//
// This class will calculate and display an amortization schedule given the
// amount of the loan, the interest rate of the loan, and the length in years
// of the loan.
//
// Optionally, it will either display the entire schedule
// or just the following calculated amounts:
//    Total amount paid over the life of the loan.
//    Total interest paid over the life of the loan.
//    Total number of monthly payments.
//    The monthly payment.
//

class Amort {

    var $amount;      //amount of the loan
    var $rate;        //percentage rate of the loan
    var $years;        //number of years of the loan
    var $npmts;        //number of payments of the loan
    var $mrate;        //monthly interest rate
    var $tpmnt;        //total amount paid on the loan
    var $tint;         //total interest paid on the loan
    var $pmnt;         //monthly payment of the loan

//amort is the constructor and sets up the variable values
//using the three values passed to it.

    function amort($amount = 0, $rate = 0, $years = 0) {
        $this->amount = $amount;   //amount of the loan
        $this->rate = $rate;       //yearly interest rate in percent
        $this->years = $years;     //length of loan in years
        if ($amount * $rate * $years > 0) {
            $this->npmts = $years * 12;  //number of payments (12 per year)
            $this->mrate = $rate / 1200; //monthly interest rate
            $this->pmnt = $amount * ($this->mrate / (1 - pow(1 + $this->mrate, -$this->npmts))); //monthly payment
            $this->tpmnt = $this->pmnt * $this->npmts;  //total amount paid at end of loan
            $this->tint = $this->tpmnt - $amount;         //total amount of interest paid at end of loan
        } else {
            $this->pmnt = 0;
            $this->npmts = 0;
            $this->mrate = 0;
            $this->tpmnt = 0;
            $this->tint = 0;
        }
    }

//returns the monthly payment in dolars (two decimal places)
    function getMonthlyPayment() {
        return sprintf("%01.2f", $this->pmnt);
    }

//returns the total amount paid at the end of the loan in dolars
    function getTotalPayment() {
        return round($this->tpmnt);
    }

//returns the total interest paid at the end of the loan in dolars
    function getTotalInterest() {
        return sprintf("%01.2f", $this->tint);
    }

}
