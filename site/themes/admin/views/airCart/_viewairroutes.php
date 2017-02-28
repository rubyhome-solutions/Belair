<div class="ibox-content">
                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                        <thead>
                            <tr>
                                <th>Airline</th>
                                <th>Flight Number</th>
                                <th>Aircraft  </th>
                                <th>Airport </th>
                                <th>Departure</th>
                                <th>Trm.</th>
                                <th>&nbsp;</th>
                                <th>Airport   </th>
                                <th>Arrival</th>
                                <th>Trm.</th>

                            </tr>
                        </thead>
                        <?php foreach ($airRoutes as $airRoute) { ?>
                        <tr>
                            <td><?php echo $airRoute->carrier->generateImgTag . "&nbsp;&nbsp;" . $airRoute->carrier->name; ?></td>
                            <td><?php echo $airRoute->carrierCodeAndFlightNumber; ?></td>
                            <td><?php echo $airRoute->aircraft; ?></td>
                            <td><?php echo $airRoute->source->nameCode; ?></td>
                            <td><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->departure_ts)); ?></td>
                            <td><?php echo $airRoute->source_terminal; ?></td>
                            <td><i class='fa fa-long-arrow-right fa-lg'></i></td>
                            <td><?php echo $airRoute->destination->nameCode; ?></td>
                            <td><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->arrival_ts)); ?></td>
                            <td><?php echo $airRoute->destination_terminal; ?></td>

                        </tr>
                        <?php } ?>
                        
                    </table>

                </div>