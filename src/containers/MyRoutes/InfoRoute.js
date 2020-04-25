import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { RouteCard, Button } from "./myroutes.style";
import { ldflexHelper } from "@utils";
import { successToaster } from "@utils";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormRenderContainer } from "../MyFriends/myfriends.style";
import RouteMap from "./RouteMap";
import Notifications from "../Share/NotificationHelp";
import MultsButton from "./ViewMult";
import i18n from "i18n";
import { Route } from "domain";
import { viadeManager } from "@utils";
import Map from "../NewRoute/Map";
import Download from '@axetroy/react-download';

import { RouteWrapper, TextArea, DivForms, LabelInput } from "../NewRoute/route.style";

var markersp = [];
const InfoRoute = (props) => {
	const { name, author, description, points, center, mult, r, uuid, ttl, error, errorMore, webID } = props;
	const [ showFriends, setShowFriends ] = useState(false);
	const [ showConfirm, setShowConfirm ] = useState(false);
	const [ showConfirmModify, setShowConfirmModify] = useState(false);
	const [ showConfirmDownload, setShowConfirmDownload] =useState(false);
	markersp = points;
	if (!error) {
		return (
			<RouteCard className="card">
			<div id="divBtns" className="btn-group-vertical">
				<Button id="btnModify" type="button" onClick={() => setShowConfirmModify(!showConfirmModify)}>
					<FontAwesomeIcon icon="pen" className="pen-icon" />
				</Button>
				<Button id="btnDownload" type="button"  onClick={() => setShowConfirmDownload(!showConfirmDownload)}>
					<FontAwesomeIcon icon="download" className="download-icon" />
				</Button>
				<Button id="btnDelete" type="button" onClick={() => setShowConfirm(!showConfirm)}>
					<FontAwesomeIcon icon="trash" className="trash-icon" />
				</Button>
			</div>
				<div id="divDelete">
					<Modal show={showConfirm} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
						<Modal.Header>
							<Modal.Title id="contained-modal-title-vcenter">{i18n.t("myRoutes.attetion")}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<h4>{i18n.t("myRoutes.sure")}</h4>
							<p>{i18n.t("myRoutes.deleteMedia")}</p>
						</Modal.Body>
						<Modal.Footer>
							<Button
								onClick={(e) => {
									for (const media of mult) {
										ldflexHelper.deleteFile(media.url);
										ldflexHelper.deleteFile(media.ttlUrl);
									}
									ldflexHelper.deleteFile(r);
									successToaster(i18n.t("myRoutes.deletingMedia"), i18n.t("newRoute.success"));
									setTimeout(function() {
										window.location.reload();
									}, 1500);
								}}
							>
								{i18n.t("myRoutes.btnDelete")}
							</Button>
							<Button onClick={() => setShowConfirm(!showConfirm)}>{i18n.t("myRoutes.btnClose")}</Button>
						</Modal.Footer>
					</Modal>
				</div>
				<div id="divModificar">
					<Modal
						id="modalMod"
						show={showConfirmModify}
						size="lg"
						aria-labelledby="contained-modal-title-vcenter"
						centered
					>
						<Modal.Header>
							<Modal.Title id="contained-modal-title-vcenter">{i18n.t("myRoutes.modify")}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<RouteWrapper data-testid="route-component">
								<div>
									<DivForms>
										<LabelInput id="labelMod">
											{i18n.t("newRoute.name")}
											<input
												type="text"
												rows="10"
												id="route_name"
												name="route_name"
												defaultValue={name}
											/>
										</LabelInput>
									</DivForms>
									<DivForms>
										<LabelInput id="labelMod">
											{i18n.t("newRoute.description")}
											<TextArea
												type="text"
												id="route_description"
												name="route_description"
												rows="10"
												defaultValue={description}
											/>
										</LabelInput>
									</DivForms>
								</div>
								<FormRenderContainer id="mapa-modal">
									<RouteMap
										parentCallBack={(childData) => {
											markersp = childData;
										}}
										markers={markersp}
										center={center}
										action={true}
									/>
								</FormRenderContainer>
							</RouteWrapper>
						</Modal.Body>
						<Modal.Footer>
							<Button
								onClick={async () => {
									let route = new Route(
										document.getElementById("route_name").value,
										author,
										document.getElementById("route_description").value,
										markersp,
										mult
									);
									ldflexHelper.deleteFile(r);
									await viadeManager.addRoute(route, webID.webId);
									successToaster(i18n.t("newRoute.modifySuccessRoute"), i18n.t("newRoute.success"));
									setTimeout(function() {
										window.location.reload();
									}, 1000);
								}}
							>
								{i18n.t("myRoutes.btnModify")}
							</Button>
							<Button onClick={() => {
								
								setShowConfirmModify(!showConfirmModify)
							}}>
								{i18n.t("myRoutes.btnClose")}
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
				<div id="divDownload">
					<Modal show={showConfirmDownload} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
						<Modal.Header>
							<Modal.Title id="contained-modal-title-vcenter">
							{i18n.t("myRoutes.downloadTitle")}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<h4>{i18n.t("myRoutes.downloadSure")}</h4>
							<p>{i18n.t("myRoutes.downloadP")}</p>
						</Modal.Body>
						<Modal.Footer>
                            <Button onClick={() => setShowConfirmDownload(!showConfirmDownload)}>
                                <Download file={uuid + ".ttl"} content={ttl}>
                                    {i18n.t("myRoutes.downloadBtn")}
                                </Download>
                            </Button>
                            <Button onClick={() => setShowConfirmDownload(!showConfirmDownload)}>
                                {i18n.t("myRoutes.btnClose")}
                            </Button>
                        </Modal.Footer>
					</Modal>
				</div>
				<h2>{name}</h2>
				<h3> {i18n.t("myRoutes.createdBy")} </h3>
				<p>{author}</p>
				<h3> {i18n.t("myRoutes.description")}</h3>
				<p>{description}</p>
				<div id="divShare" className="btn-group">
					<Button id="viewFriends" type="button" onClick={() => setShowFriends(!showFriends)}>
						{i18n.t("myRoutes.btnShare")}
					</Button>
					<MultsButton {...{ mult, name }} />
				</div>
				<div id="divFriends">
					<Modal show={showFriends} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
						<Modal.Header>
							<Modal.Title id="contained-modal-title-vcenter">
							{i18n.t("myRoutes.friends")}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Notifications ruta={uuid}></Notifications>
						</Modal.Body>
						<Modal.Footer>
                            <Button onClick={() => setShowFriends(!showFriends)}>
                                {i18n.t("myRoutes.btnClose")}
                            </Button>
                        </Modal.Footer>
					</Modal>
				</div>
				<br />
				<FormRenderContainer id="mapa">
					<RouteMap markers={points} center={center} />
				</FormRenderContainer>
				<br />
			</RouteCard>
		);
	} else {
		return (
			<RouteCard className="card">
				<h5>{error}</h5>
				<p> {errorMore} </p>
			</RouteCard>
		);
	}
};

export default InfoRoute;
