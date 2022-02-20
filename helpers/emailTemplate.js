exports.htmlTemplate = (body) => {
  console.log(body);
  const { booking_reference, check_in, check_out, _doc } = body;
  const {
    first_name,
    last_name,
    contact_number,
    no_guest,
    street_address,
    city,
    province,
  } = _doc;
  return `
<html>
  <style></style>
  <body
    style="
      background-color: #ffffff;
      font-family: Open Sans, sans-serif;
      font-size: 100%;
      font-weight: 400;
      line-height: 1.4;
      color: #000;
    "
  >
    <table
      style="
        max-width: 670px;
        margin: 50px auto 10px;
        background-color: #efefef;
        padding: 50px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
          0 1px 2px rgba(0, 0, 0, 0.24);
        -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
          0 1px 2px rgba(0, 0, 0, 0.24);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        border-top: solid 10px #ef7e24;
        box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
      "
    >
      <thead>
        <tr>
          <th style="text-align: left" colspan="4">
            <!-- <img style="max-width: 70px" src="cid:logo_2u" /><strong> -->
              Villa Gregoria Resort</strong
            >
          </th>
          <th style="text-align: right; font-weight: 400">
            '.$reservation_date.'
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style="
              height: 35px;
              text-align: center;
              padding: 2rem;
              color: #17a2b8 !important;
            "
            colspan="5"
          >
            <h2>THANK YOU FOR BOOKING WITH US!</h2>
          </td>
        </tr>

        <!-- <tr>
          <td colspan="5" style="border: solid 1px #ddd; padding: 10px 20px">
            <p style="font-size: 14px; margin: 0 0 6px 0">
              <span
                style="
                  font-weight: bold;
                  display: inline-block;
                  min-width: 150px;
                "
                >Status</span
              ><b style="color: red; font-weight: normal; margin: 0">Pending</b>
            </p>

            <p style="font-size: 14px; margin: 0 0 6px 0">
              <span
                style="
                  font-weight: bold;
                  display: inline-block;
                  min-width: 146px;
                "
                >Booking Reference</span
              >
              ' . $booking_reference . '
            </p>
            <p style="font-size: 14px; margin: 0 0 0 0">
              <span
                style="
                  font-weight: bold;
                  display: inline-block;
                  min-width: 146px;
                "
                >Payment Due</span
              >' . $expiration_date . '
            </p>
          </td>
        </tr> -->

        <tr>
          <td
            style="width: 50%; padding: 20px; vertical-align: top"
            colspan="5"
          >
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >BOOKING REFERENCE: <b>${booking_reference}</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Name: <b>${first_name} ${last_name}</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Contact Number: <b>${contact_number}</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Address: <b>${street_address}, ${city} , ${province}</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Number of Guest: <b>${no_guest}</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Number of Nights: <b>${no_guest}</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Check-In: <b>${check_in} 2:00PM</b></span
            ><br />
            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 2em;
                font-style: italic;
              "
              >Check-Out: <b>${check_out} 12:00 PM</b></span
            ><br />

            <span
              style="
                font-weight: lighter;
                font-size: 15px;
                line-height: 5em;
                font-style: italic;
              "
              >Payment Due: <b>${check_out} 12:00 PM</b></span
            ><br />
            <br />
            <!-- <p style="margin: 0 0 10px 0; padding: 0; font-size: 14px">
              <span style="display: block; font-weight: bold; font-size: 13px"
                >Name</span
              >
              ' . $first_name . ' ' . $last_name . '
            </p>
            <p style="margin: 0 0 10px 0; padding: 0; font-size: 14px">
              <span style="display: block; font-weight: bold; font-size: 13px"
                >Email</span
              >
              ' . $email . '
            </p>
            <p style="margin: 0 0 10px 0; padding: 0; font-size: 14px">
              <span style="display: block; font-weight: bold; font-size: 13px"
                >Phone</span
              >
              ' . $contact_number . '
            </p> -->
          </td>
          <!-- <td
            style="width: 50%; padding: 20px; vertical-align: top"
            colspan="2"
          >
            <p style="margin: 0 0 10px 0; padding: 0; font-size: 14px">
              <span style="display: block; font-weight: bold; font-size: 13px"
                >Address</span
              >
              ' . $address . ', ' . $city . ', ' . $zipcode . '
            </p>
            <p style="margin: 0 0 10px 0; padding: 0; font-size: 14px">
              <span style="display: block; font-weight: bold; font-size: 13px"
                >Number of guest</span
              >
              ' . $num_guest . '
            </p>
            <p style="margin: 0 0 10px 0; padding: 0; font-size: 14px">
              <span style="display: block; font-weight: bold; font-size: 13px"
                >Duration of your vacation</span
              >

              <small
                >' . date_format(date_create($check_in),"Y-m-d (l)") . '</small
              >
              to
              <small
                >' . date_format(date_create($check_out),"Y-m-d (l)") .
                '.</small
              >
            </p>
          </td> -->
        </tr>
        <tr>
          <th
            style="
              font-size: 14px;
              padding: 10px;
              border-bottom: 3px solid #929090;
              border-top: 3px solid #929090;
            "
            colspan="2"
          >
            Availed
          </th>
          <th
            style="
              font-size: 14px;
              padding: 10px;
              border-bottom: 3px solid #929090;
              border-top: 3px solid #929090;
            "
          >
            Rate
          </th>

          <th
            style="
              font-size: 14px;
              padding: 10px;
              border-bottom: 3px solid #929090;
              border-top: 3px solid #929090;
            "
          >
            Qty
          </th>
          <th
            style="
              font-size: 14px;
              padding: 10px;
              border-bottom: 3px solid #929090;
              border-top: 3px solid #929090;
            "
          >
            Total Amount
          </th>
        </tr>
        <tr style="text-align: center">
          <td style="padding: 15px" colspan="2">
            <p
              style="
                font-size: 14px;
                margin: 0;
                padding: 0px;
                font-weight: bold;
                white-space: nowrap;
              "
            >
              <span style="display: block; font-size: 13px; font-weight: normal"
                >Room 2 pax with tae tae</span
              >
            </p>
          </td>
          <td style="padding: 15px">
            <p
              style="
                font-size: 14px;
                margin: 0;
                padding: 0px;
                font-weight: bold;
                white-space: nowrap;
              "
            >
              <span style="display: block; font-size: 13px; font-weight: normal"
                >₱ 2000
              </span>
            </p>
          </td>

          <td style="padding: 15px">
            <p
              style="
                font-size: 14px;
                margin: 0;
                padding: 0px;
                font-weight: bold;
              "
            >
              <span style="display: block; font-size: 13px; font-weight: normal"
                >5</span
              >
            </p>
          </td>
          <td style="padding: 15px">
            <p
              style="
                font-size: 14px;
                margin: 0;
                padding: 0px;
                font-weight: bold;
              "
            >
              <span style="display: block; font-size: 13px; font-weight: normal"
                >₱5000</span
              >
            </p>
          </td>
        </tr>
      </tbody>
      <tfooter>
        <tr style="text-align: center">
          <td></td>
          <td></td>
          <td></td>
          <td
            style="
              font-size: 14px;
              padding: 10px 15px 0 15px; /*border-bottom: 3px solid #929090;*/
            "
          >
            <b>Subtotal</b>
          </td>
          <td
            colspan="1"
            style="
              font-size: 14px;
              padding: 10px 15px 0 15px; /*border-bottom: 3px solid #929090;*/
            "
          >
            ₱'.number_format($total_amount,2).'
          </td>
        </tr>
        <tr style="text-align: center">
          <td></td>
          <td></td>
          <td></td>
          <td style="font-size: 14px; padding: 10px 15px 0 15px">
            <b>Vatable Sales</b>
          </td>
          <td colspan="1" style="font-size: 14px; padding: 10px 15px 0 15px">
            ₱'.number_format($vatable,2).'
          </td>
        </tr>
        <tr style="text-align: center">
          <td></td>
          <td></td>
          <td></td>
          <td style="font-size: 14px; padding: 10px 15px 0 15px">
            <b>VAT (12%)</b>
          </td>
          <td colspan="1" style="font-size: 14px; padding: 10px 15px 0 15px">
            ₱'.number_format($vat,2).'
          </td>
        </tr>
        <tr style="text-align: center">
          <td></td>
          <td></td>
          <td></td>
          <td
            style="
              font-size: 14px;
              padding: 10px 15px 0 15px; /*border-bottom: 3px solid #929090;*/
            "
          >
            <b>Total Amount</b>
          </td>
          <td
            colspan="1"
            style="
              font-size: 14px;
              padding: 10px 15px 0 15px; /*border-bottom: 3px solid #929090;*/
            "
          >
            ₱'.number_format($total_amount,2).'
          </td>
        </tr>
        <!--<tr style="text-align: center;">
          <td></td>
          <td></td>
          <td></td>
          <td style="font-size:14px;padding:10px 15px 0 15px;"><b>Payed Amount</b></td>
        <td colspan="1" style="font-size:14px;padding:10px 15px 0 15px;">
         Php 5,000.00
        </td>
      </tr> 
        <tr style="text-align: center;">
          <td></td>
          <td></td>
          <td></td>
          <td style="font-size:14px;padding:10px 15px 0 15px;"><b>Balance</b></td>
        <td colspan="1" style="font-size:14px;padding:10px 15px 0 15px;">
         Php 5,000.00
        </td>
      </tr>-->
      </tfooter>
      <tr>
        <td style="height: 3rem"></td>
      </tr>
      <tr>
        <td colspan="5">
          <b style="font-family: Arial, Helvetica, sans-serif">HOW TO PAY?</b>
        </td>
      </tr>
      <tr>
        <td colspan="5" style="color: #6b6b6b">
          * Payment is available only for Bank Deposit / BDO Account number -
          006844224985 | BDO Account name - Villa Gregoria Resort
        </td>
      </tr>
      <tr>
        <td colspan="5" style="color: #6b6b6b">
          * Deposit your 50% Downpayment to bank, <br />and upload your picture
          of bank receipt here
          <a href="https://villagregoriaresort.com/my-booking?awakeNavBar=true" target="_blank"
            >My Booking</a
          >
        </td>
      </tr>

      <tr>
        <td style="height: 1rem"></td>
      </tr>
      <tr>
        <td colspan="5">
          <b style="font-family: Arial, Helvetica, sans-serif"
            >POLICY & CONDITIONS</b
          >
        </td>
      </tr>
      <tr>
        <td colspan="5" style="color: #6b6b6b">
          *You need to pay your 50% downpayment before payment due, else your
          booking will be voided
        </td>
      </tr>
      <tr>
        <td colspan="5" style="color: #6b6b6b">
          *Downpayment is strictly 50% of the Total amount only
        </td>
      </tr>
      <tr>
        <td colspan="5" style="color: #6b6b6b">
          *No Cancellation/Re-book once the booking is paid
        </td>
      </tr>
      <tr>
        <td colspan="5" style="color: #6b6b6b">*No Refund</td>
      </tr>
    </table>
  </body>
</html>


 `;
};
