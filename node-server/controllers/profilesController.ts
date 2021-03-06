import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../logger";
import { IProfilePatchRequest } from "../types";
import { IResponseLocals } from "../types/auth";
import { userProfileService } from "../services";

export async function getUserProfile(_: Request, res: Response) {
    const { user } = res.locals as IResponseLocals;
    logger.info({
        message: `Getting profile for user id ${user.uid}`
    });

    const profile = await userProfileService.getProfileByUserId(user.uid);

    if (!profile) {
        logger.error({
            message: `Profile not found for user id ${user.uid}`
        });

        return res.status(StatusCodes.NOT_FOUND).json({
            message: 'User profile not found'
        });
    }

    logger.info({
        message: 'User profile found',
        data: profile
    });

    return res.status(StatusCodes.OK).json(profile);
}

export async function updateUserProfile(req: Request, res: Response) {
    const { user } = res.locals as IResponseLocals;
    logger.info({
        message: `Updating profile for user id ${user.uid}`
    });

    try {
        const updatedProfile = await userProfileService.createOrUpdateProfile(user.uid, req.body as IProfilePatchRequest);
        return res.status(StatusCodes.CREATED).json(updatedProfile);
    } catch (error) {
        logger.error({
            message: 'Error occured while updating profile',
            data: error
        })
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}