import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Stack } from '@chakra-ui/react';
import { TriangleUpIcon, StarIcon } from "@chakra-ui/icons"
import ReactMapGl, { Marker, ScaleControl, NavigationControl } from "react-map-gl";
import { useStore } from '@/store/index';

export const MapBox = observer(() => {
  const { rec } = useStore();

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 10,
    width: '80vw',
    height: '50vh'
  })

  useEffect(() => {
    if (rec.decodedRecords[rec.decodedRecords.length - 1]) {
      setViewport({
        ...viewport,
        latitude: rec.decodedRecords[rec.decodedRecords.length - 1].latitude.shiftedBy(-7).toNumber(),
        longitude: rec.decodedRecords[rec.decodedRecords.length - 1].longitude.shiftedBy(-7).toNumber()
      })
    }
  }, [rec.decodedRecords]);

  return(
    <Container>
      <ReactMapGl
        {...viewport}
        mapboxApiAccessToken={"pk.eyJ1Ijoibmlja3lydSIsImEiOiJja3R0b2gwcHExcjgxMnBvMnNpdGRzZ3h0In0.SVZh89vCelDpCAjIjy-HBQ"}
        onViewportChange={(viewport) => {
          setViewport(viewport);}}

      >
        <Stack spacing="24px">
          <ScaleControl/>
          <NavigationControl/>
        </Stack>
        {rec.decodedRecords?.map((record) => (
          <Marker
            key={record.random}
            latitude={record.latitude.shiftedBy(-7).toNumber()}
            longitude={record.longitude.shiftedBy(-7).toNumber()}
          >
            <TriangleUpIcon color={"black"}/>
          </Marker>
        ))}

        <Marker longitude={viewport.longitude} latitude={viewport.latitude}>
          <StarIcon color={"red"}/>
        </Marker>
      </ReactMapGl>
      <TriangleUpIcon/> - all datapoints
      <StarIcon ml={5} color={"red"}/> - last datapoint
    </Container>
  );
});