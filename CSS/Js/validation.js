function number(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
Swal.fire({
  title: 'Error!',
  text: 'Solo se permiten numeros',
  icon: 'error',
  confirmButtonText: 'OK'
})
    return false;
  }
  return true;
}
